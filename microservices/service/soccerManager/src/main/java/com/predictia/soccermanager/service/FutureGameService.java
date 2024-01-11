package com.predictia.soccermanager.service;

import com.predictia.dto.FutureGameDTO;
import com.predictia.soccermanager.mapper.FutureGameMapper;
import com.predictia.soccermanager.model.FutureGameModel;
import com.predictia.soccermanager.repository.FutureGameRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class FutureGameService {
    private String API_KEY = "7dcfc4cf6b4f4a2eb607ed5ef6f2705d";
    private String API_URL = "https://api.football-data.org/";

    @Autowired
    private FutureGameRepository futureGameRepository;

    @Autowired
    private FutureGameMapper futureGameMapper;

    public void getAllFutureGames() throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.football-data.org/v4/matches/?status=SCHEDULED"))
                .header("X-Auth-Token", API_KEY)
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.statusCode());
        System.out.println(response.body());
    }

    public HttpResponse<String> getFromAPINextGamesInRange(LocalDate dateFrom, LocalDate dateTo) throws IOException, InterruptedException, JSONException {
        String filterRequest = "?status=SCHEDULED";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String formattedDateTo = dateTo.format(formatter);
        String formattedDateFrom = dateFrom.format(formatter);

        filterRequest = "&dateFrom=" + formattedDateFrom + "&dateTo=" + formattedDateTo;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL+"v4/matches?"+filterRequest))
                .header("X-Auth-Token", API_KEY)
                .build();

        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    @Transactional
    public List<FutureGameDTO> getAllRangeWeekMatch(LocalDate startDate, LocalDate endDate) throws JSONException, IOException, InterruptedException {
        List<FutureGameModel> futureGameModelExistWithDate = futureGameRepository.findAllByModifiedDateVerification(LocalDate.now());
        List<FutureGameModel> filteredGames = new ArrayList<>();

        if (startDate == null || endDate == null) {
            startDate = LocalDate.now();
            endDate = startDate.plusWeeks(1);
        }

        if(futureGameModelExistWithDate.isEmpty()) {
            HttpResponse<String> response = getFromAPINextGamesInRange(startDate, endDate);

            // Parsing la réponse API en tant qu'objet JSON
            JSONObject responseJson = new JSONObject(response.body());

            // Récupération du tableau des matches
            JSONArray matchesArray = responseJson.getJSONArray("matches");

            // Boucle pour parcourir tous les matches
            for (int i = 0; i < matchesArray.length(); i++) {

                JSONObject matchObj = matchesArray.getJSONObject(i);

                // Récupération des détails du match
                JSONObject homeTeamObj = matchObj.getJSONObject("homeTeam");
                JSONObject awayTeamObj = matchObj.getJSONObject("awayTeam");
                JSONObject scoreObj = matchObj.getJSONObject("score");

                String utcDate = matchObj.getString("utcDate");
                String status = matchObj.getString("status");
                Integer homeclubId = Integer.parseInt(homeTeamObj.getString("id"));
                Integer awayClubid = Integer.parseInt(awayTeamObj.getString("id"));
                String homeShortName = homeTeamObj.getString("shortName");
                String awayShortName = awayTeamObj.getString("shortName");

                FutureGameModel futureGameModel = futureGameRepository.findFutureGameModelByHomeClubShortNameAndAwayClubShortName(homeShortName, awayShortName);
                if(futureGameModel == null) {
                    futureGameModel = new FutureGameModel();
                }

                futureGameModel.setHomeClubId(homeclubId);
                futureGameModel.setHomeClubShortName(homeShortName);
                futureGameModel.setAwayClubId(awayClubid);
                futureGameModel.setAwayClubShortName(awayShortName);
                futureGameModel.setStatus(status);
                futureGameModel.setModifiedDateVerification(LocalDate.now());

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");
                LocalDateTime dateTime = LocalDateTime.parse(utcDate, formatter);
                LocalDate localDate = dateTime.toLocalDate();
                futureGameModel.setGameDate(localDate);

                filteredGames.add(futureGameModel);
            }
            futureGameRepository.saveAll(filteredGames);
        }
        else {
            Iterable<FutureGameModel> futureGames = futureGameRepository.findAll();
            for (FutureGameModel game : futureGames) {
                LocalDate gameDate = game.getGameDate();

                if ((gameDate.isAfter(startDate) && gameDate.isBefore(endDate)) || gameDate.isEqual(LocalDate.now())) {
                    filteredGames.add(game);
                }
            }
        }

        return filteredGames.stream().sorted(Comparator.comparing(FutureGameModel::getGameDate)).map(fgm -> futureGameMapper.futurGameEntityToFuturGameDTO(fgm)).toList();
    }

    @Transactional
    public FutureGameDTO createOrUpdate(FutureGameDTO futureGameDTO){
        FutureGameModel fgm = futureGameMapper.futurGameDTOToFuturGameEntity(futureGameDTO);
        futureGameRepository.save(fgm);
        return futureGameMapper.futurGameEntityToFuturGameDTO(fgm);
    }

    @Transactional
    public void deleteById(Integer id){
        futureGameRepository.deleteById(id);
    }
}
