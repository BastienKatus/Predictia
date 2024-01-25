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
        JSONObject prediction = helperAPIService.callAPI("DATA", "prediction/predict?home_team_id=" + betDTO.getClubHomeId() + "&away_team_id=" + betDTO.getClubAwayId());
        BetDTO betResult = new BetDTO();
        try {
            System.out.println(prediction);
            Float predictionDraw = Float.valueOf(prediction.getString("probabilite_nul"));
            Float predictionWinHome = Float.valueOf(prediction.getString("probabilite_victoire"));
            Float predictionWinAway = Float.valueOf(prediction.getString("probabilite_defaite"));

            Float playerPredictionWinHome = betDTO.getBetWinHomeClub();
            Float playerPredictionWinAway = betDTO.getBetWinAwayClub();
            Float playerPredictionDraw = betDTO.getBetDraw();

            float coefficient = 0f;
            float difference = 0f;
            if(Objects.equals(playerPredictionWinHome, predictionWinHome) && Objects.equals(playerPredictionDraw, predictionDraw) && Objects.equals(playerPredictionWinAway, predictionWinAway)){
                coefficient += 5;
            } else {
                difference = Math.abs(predictionWinHome - playerPredictionWinHome)
                        + Math.abs(predictionWinAway - playerPredictionWinAway)
                        + Math.abs(predictionDraw - playerPredictionDraw);

                String whichResultForPlayer = getFinalMatchStatus(playerPredictionWinHome, playerPredictionDraw, playerPredictionWinAway);
                String whichResultForPredictia = getFinalMatchStatus(predictionWinHome, predictionDraw, predictionWinAway);

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
            UserDTO updatedUser = null;
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
                updatedUser = response.getBody();
            }
            if(updatedUser != null) {
                betResult = betDTO;
                betResult.setPrize(creditsRedistributed);
                betResult.setPredictionResultDraw(predictionDraw);
                betResult.setPredictionResultWinAwayClub(predictionWinAway);
                betResult.setPredictionResultWinHomeClub(predictionWinHome);
            }
        } catch (Exception e) {
            // Return an empty betDTO object
            System.out.println("Crédits in catch" + betResult.toString());
            return betResult;
        }
        System.out.println("Crédits" + betResult.toString());
        // Return the betResult object. Attributes are null if the user is not updated.
        return betResult;
    }

    private String getFinalMatchStatus(Float percentWinHome, Float percentDraw, Float percentWinAway){
        if (percentWinHome > 0.6f && percentWinHome > percentWinAway) {
            return "HOME";
        } else if (percentWinAway > 0.6f && percentWinAway > percentWinHome) {
            return "AWAY";
        } else if ((percentWinHome < 0.6f && percentWinHome > 0.4f)
                || (percentWinAway < 0.6f && percentWinAway > 0.4f)
                || (percentDraw > 0.2f)) {
            return "DRAW";
        }
        return "DRAW";
    }
}
