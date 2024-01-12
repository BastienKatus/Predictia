package com.predictia.soccermanager.service;

import com.predictia.dto.GameDTO;
import com.predictia.soccermanager.mapper.GameMapper;
import com.predictia.soccermanager.model.GameModel;
import com.predictia.soccermanager.repository.GameRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DataCommunicationService {

    private String API_URL = "http://localhost:5000";
    private static final Log log = LogFactory.getLog(DataCommunicationService.class);
    public JSONObject callDataAPI(String endpoint) {
        HttpResponse<String> response = null;
        JSONObject responseJSONObject = null;
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL + endpoint))
                    .build();
            try {
                response = client.send(request, HttpResponse.BodyHandlers.ofString());
            } catch (IOException | InterruptedException e) {
                log.debug("Error while executing request");
            }
        } catch (Exception e) {
            log.debug("Error while creating request");
        }

        try {
            if (response != null) {
                 responseJSONObject = new JSONObject(response.body());
            }
        } catch (JSONException e) {
            log.debug("Error while parsing response");
        }
        return responseJSONObject;
    }

    public JSONObject getPlayers()  {
        return callDataAPI("/players");
    }

    public JSONObject getPlayerValuations()  {
        return callDataAPI("/player_valuations");
    }

    public JSONObject getPlayerValuationsById(String playerId)  {
        return callDataAPI("/player_valuations/club/" + playerId);
    }

    public JSONObject getPlayerById(String playerId)  {
        return callDataAPI("/players/" + playerId);
    }

    public JSONObject getClubs()  {
        return callDataAPI("/clubs");
    }

    public JSONObject getClubById(String clubId)  {
        return callDataAPI("/clubs/" + clubId);
    }

    public JSONObject getClubGames()  {
        return callDataAPI("/club_games");
    }

    public JSONObject getClubGameByClubId(String clubId)  {
        return callDataAPI("/club_games/club/" + clubId);
    }

    public JSONObject getClubGameByGameId(String gameId)  {
        return callDataAPI("/club_games/" + gameId);
    }

    public JSONObject getGames()  {
        return callDataAPI("/games");
    }

    public JSONObject getGameById(String gameId)  {
        return callDataAPI("/games/" + gameId);
    }

    public JSONObject getGameEvents()  {
        return callDataAPI("/game_events");
    }

    public JSONObject getGameEventById(String gameEventId)  {
        return callDataAPI("/game_events/" + gameEventId);
    }

    public JSONObject getGameLineups()  {
        return callDataAPI("/game_lineups");
    }

    public JSONObject getGameLineupsById(String gameLineupsId)  {
        return callDataAPI("/game_lineups/" + gameLineupsId);
    }

    public JSONObject getCompetitions()  {
        return callDataAPI("/competitions");
    }

    public JSONObject getCompetitionById(String competitionId)  {
        return callDataAPI("/competitions/" + competitionId);
    }

    public JSONObject getAppearances()  {
        return callDataAPI("/appearances");
    }

    public JSONObject getAppearanceById(String appearanceId)  {
        return callDataAPI("/appearances/" + appearanceId);
    }

    public JSONObject predict()  {
        return callDataAPI("/predict");
    }

}
