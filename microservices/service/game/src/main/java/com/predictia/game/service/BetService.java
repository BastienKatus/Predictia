package com.predictia.game.service;

import com.predictia.dto.AuthDTO;
import com.predictia.dto.BetDTO;
import com.predictia.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Objects;

@Service
public class BetService {

    @Autowired
    private HelperAPIService helperAPIService;

    public BetDTO betAgainstPredictia(BetDTO betDTO){
        JSONObject prediction = helperAPIService.callAPI("DATA", "/predict?home_team_id=" + betDTO.getClubHomeId() + "&away_team_id=" + betDTO.getClubAwayId());
        try {
            System.out.println(prediction);
            Float predictionDraw = Float.valueOf(prediction.getString("probabilite_nul"));
            Float predictionWinHome = Float.valueOf(prediction.getString("probabilite_victoire"));
            Float predictionWinAway = Float.valueOf(prediction.getString("probabilite_defaite"));

            Float playerPredictionWinHome = betDTO.getBetWinHomeClub();
            Float playerPredictionWinAway = betDTO.getBetWinAwayClub();
            Float playerPredictionDraw = betDTO.getBetDraw();

            Float coefficient = 0f;
            Float difference = 0f;
            if(Objects.equals(playerPredictionWinHome, predictionWinHome) && Objects.equals(playerPredictionDraw, predictionDraw) && Objects.equals(playerPredictionWinAway, predictionWinAway)){
                coefficient += 5;
            } else {
                difference = Math.abs(predictionWinHome - playerPredictionWinHome)
                        + Math.abs(predictionWinAway - playerPredictionWinAway)
                        + Math.abs(predictionDraw - playerPredictionDraw);

                String whichResultForPlayer = "";
                if (playerPredictionWinHome > 0.6f && playerPredictionWinHome > playerPredictionWinAway) {
                    whichResultForPlayer = "HOME";
                } else if (playerPredictionWinAway > 0.6f && playerPredictionWinAway > playerPredictionWinHome) {
                    whichResultForPlayer = "AWAY";
                } else if ((playerPredictionWinHome > 0.6f && playerPredictionWinHome < 0.4f)
                        || (playerPredictionWinAway > 0.6f && playerPredictionWinAway < 0.4f)
                        || (playerPredictionDraw > 0.2f)) {
                    whichResultForPlayer = "DRAW";
                }

                String whichResultForPredictia = "";
                if (predictionWinHome > 0.6f && predictionWinHome > predictionWinAway) {
                    whichResultForPredictia = "HOME";
                } else if (predictionWinAway > 0.6f && predictionWinAway > predictionWinHome) {
                    whichResultForPredictia = "AWAY";
                } else if ((predictionWinHome > 0.6f && predictionWinHome < 0.4f)
                        || (predictionWinAway > 0.6f && predictionWinAway < 0.4f)
                        || (predictionDraw > 0.2f)) {
                    whichResultForPredictia = "DRAW";
                }

                if(whichResultForPlayer.equals(whichResultForPredictia)){
                    if(whichResultForPlayer.equals("DRAW")){
                        coefficient += 3f;
                    } else {
                        coefficient += 2;
                    }
                }
            }

            Float finalCoefficient = (coefficient - difference)-1;
            float creditsRedistributed = betDTO.getBet() + (betDTO.getBet() * finalCoefficient);
            System.out.println("Gain de credits = " + creditsRedistributed);

            String getUserURL = "http://localhost:8080/users/"+betDTO.getUserId();
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<UserDTO> response = restTemplate.exchange( getUserURL, HttpMethod.GET, null, UserDTO.class);
            UserDTO user = response.getBody();
            if(user != null){
                BigDecimal userCredits;
                if(user.getCredits() == null ){
                    userCredits = BigDecimal.valueOf(0);
                }else {
                    userCredits = user.getCredits();
                }
                user.setCredits(BigDecimal.valueOf(Float.parseFloat(userCredits.toString()) + creditsRedistributed));

                String apiUrl = "http://localhost:8080/users/register";

                restTemplate = new RestTemplate();

                HttpEntity<UserDTO> request = new HttpEntity<>(user);

                response = restTemplate.exchange(apiUrl, HttpMethod.POST, request, UserDTO.class);
                UserDTO updatedUser = response.getBody();
            }
        } catch (Exception e) {
            return new BetDTO();
        }
        return new BetDTO();
    }
}
