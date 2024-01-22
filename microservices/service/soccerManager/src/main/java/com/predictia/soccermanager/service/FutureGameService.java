package com.predictia.soccermanager.service;

import com.predictia.dto.FutureGameDTO;
import com.predictia.soccermanager.mapper.FutureGameMapper;
import com.predictia.soccermanager.model.ClubLinkModel;
import com.predictia.soccermanager.model.FutureGameModel;
import com.predictia.soccermanager.repository.ClubLinkRepository;
import com.predictia.soccermanager.repository.FutureGameRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


@Service
public class FutureGameService {

    @Autowired
    private ClubLinkRepository clubLinkRepository;

    @Autowired
    private FutureGameRepository futureGameRepository;

    @Autowired
    private FutureGameMapper futureGameMapper;

    @Autowired
    private HelperAPIService helperAPIService;

    public void getAllFutureGames(){
        helperAPIService.callAPI("EXT", "v4/matches/?status=SCHEDULED");
    }

    public JSONObject getFromAPINextGamesInRange(LocalDate dateFrom, LocalDate dateTo) {
        String filterRequest = "?status=SCHEDULED";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String formattedDateTo = dateTo.format(formatter);
        String formattedDateFrom = dateFrom.format(formatter);

        filterRequest += "&dateFrom=" + formattedDateFrom + "&dateTo=" + formattedDateTo;

        return helperAPIService.callAPI("EXT", "v4/matches?"+filterRequest);
    }

    @Transactional
    public List<FutureGameDTO> getAllRangeWeekMatch(LocalDate startDate, LocalDate endDate) throws JSONException {
        List<FutureGameModel> futureGameModelExistWithDate = futureGameRepository.findAllByModifiedDateVerification(LocalDate.now());
        List<FutureGameModel> filteredGames = new ArrayList<>();

        if (startDate == null || endDate == null) {
            startDate = LocalDate.now();
            endDate = startDate.plusWeeks(1);
        }

        if(futureGameModelExistWithDate.isEmpty()) {

            // Parsing la réponse API en tant qu'objet JSON
            JSONObject responseJson = getFromAPINextGamesInRange(startDate, endDate);

            // Récupération du tableau des matches
            JSONArray matchesArray = responseJson.getJSONArray("matches");

            // Boucle pour parcourir tous les matches
            for (int i = 0; i < matchesArray.length(); i++) {

                JSONObject matchObj = matchesArray.getJSONObject(i);

                // Récupération des détails du match
                JSONObject homeTeamObj = matchObj.getJSONObject("homeTeam");
                JSONObject awayTeamObj = matchObj.getJSONObject("awayTeam");
                JSONObject scoreObj = matchObj.getJSONObject("score");
                JSONObject competitionObj = matchObj.getJSONObject("competition");

                List<String> list = Arrays.asList("PL", "FL1", "BL1", "SA", "DED", "PPL", "PD");
                if (list.contains(competitionObj.getString("code"))) {
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

                    futureGameModel.setHomeClubShortName(homeShortName);
                    futureGameModel.setAwayClubShortName(awayShortName);
                    futureGameModel.setStatus(status);
                    futureGameModel.setModifiedDateVerification(LocalDate.now());

                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");
                    LocalDateTime dateTime = LocalDateTime.parse(utcDate, formatter);
                    LocalDate localDate = dateTime.toLocalDate();
                    futureGameModel.setGameDate(localDate);

                    // Transform Ids of club retrieve from external API into data Ids
                    Optional<ClubLinkModel> homeClubLink = clubLinkRepository.findById(homeclubId);
                    Optional<ClubLinkModel> awayClubLink = clubLinkRepository.findById(awayClubid);

                    // Compute the prediction
                    if(homeClubLink.isPresent()
                            && awayClubLink.isPresent()
                            && homeClubLink.get().getId() != null
                            && awayClubLink.get().getId() != null){
                        JSONObject prediction = helperAPIService.callAPI("DATA", "/predict?home_team_id=" + homeClubLink.get().getIdSoccerManager() + "&away_team_id=" + awayClubLink.get().getIdSoccerManager());
                        if(prediction != null) {
                            try {
                                futureGameModel.setPredictionDraw(Float.parseFloat(prediction.getString("probabilite_nul")));
                                futureGameModel.setPredictionWinHome(Float.parseFloat(prediction.getString("probabilite_victoire")));
                                futureGameModel.setPredictionWinAway(Float.parseFloat(prediction.getString("probabilite_defaite")));
                            } catch (Exception e){
                                e.printStackTrace();
                            }
                        }
                        futureGameModel.setHomeClubId(homeClubLink.get().getIdSoccerManager());
                        futureGameModel.setAwayClubId(awayClubLink.get().getIdSoccerManager());
                        futureGameModel.setHomeClubLogoUrl(homeClubLink.get().getLogo());
                        futureGameModel.setAwayClubLogoUrl(awayClubLink.get().getLogo());
                    }
                    filteredGames.add(futureGameModel);


                }
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
