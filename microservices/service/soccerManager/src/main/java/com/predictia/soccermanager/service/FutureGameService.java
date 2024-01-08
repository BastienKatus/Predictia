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
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;


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

    public List<FutureGameDTO> getRangeDateFutureGames(Date dateFrom, Date dateTo) throws IOException, InterruptedException, JSONException {
        String filterRequest = "?status=SCHEDULED";

        if(dateFrom == null || dateTo == null) {
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.WEEK_OF_YEAR, 1);
            dateTo = calendar.getTime();
            dateFrom = Calendar.getInstance().getTime();
        }
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String formattedDateTo = dateFormat.format(dateTo);
        String formattedDateFrom = dateFormat.format(dateFrom);

        filterRequest = "&dateFrom=" + formattedDateFrom + "&dateTo=" + formattedDateTo;
        System.out.println("filterRequest: " + filterRequest);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL+"v4/matches?"+filterRequest))
                .header("X-Auth-Token", API_KEY)
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.statusCode());
        System.out.println(response.body());

        // Parsing la réponse API en tant qu'objet JSON
        JSONObject responseJson = new JSONObject(response.body());

        // Récupération du tableau des matches
        JSONArray matchesArray = responseJson.getJSONArray("matches");

        List<FutureGameModel> games = new ArrayList<>();
        // Boucle pour parcourir tous les matches
        for (int i = 0; i < matchesArray.length(); i++) {
            FutureGameModel futureGameModel = new FutureGameModel();
            JSONObject matchObj = matchesArray.getJSONObject(i);

            // Récupération des détails du match
            String utcDate = matchObj.getString("utcDate");
            String status = matchObj.getString("status");
            JSONObject homeTeamObj = matchObj.getJSONObject("homeTeam");
            JSONObject awayTeamObj = matchObj.getJSONObject("awayTeam");
            JSONObject scoreObj = matchObj.getJSONObject("score");

            futureGameModel.setHomeClubShortName(homeTeamObj.getString("shortName"));
            futureGameModel.setAwayClubShortName(awayTeamObj.getString("shortName"));

            games.add(futureGameModel);
        }
        futureGameRepository.saveAll(games);
        return games.stream().map(fgm -> futureGameMapper.futurGameEntityToFuturGameDTO(fgm)).toList();
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
