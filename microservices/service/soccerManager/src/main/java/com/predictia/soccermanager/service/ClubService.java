package com.predictia.soccermanager.service;

import com.predictia.dto.ClubDTO;
import com.predictia.dto.GameDTO;
import com.predictia.soccermanager.mapper.ClubMapper;
import com.predictia.soccermanager.model.ClubModel;
import com.predictia.soccermanager.repository.ClubLinkRepository;
import com.predictia.soccermanager.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private ClubMapper clubMapper;

    @Autowired
    private  GameService gameService;

    @Autowired
    private ClubLinkRepository clubLinkRepository;

    @Autowired
    private HelperAPIService helperAPIService;

    public List<ClubDTO> getAllClubs()  {
        Iterable<ClubModel> clubModels =  clubRepository.findAll();
        List<ClubModel> clubModelList = new ArrayList<>();
        clubModels.forEach(clubModelList::add);
        return new ArrayList<>(clubMapper.listClubEntityToClubDTO(clubModelList));

    }

    public ClubDTO getClubById(Integer id)  {
        Optional<ClubModel> clubModel = clubRepository.findById(id);
        if(clubModel.isPresent()) {
            List<GameDTO> gameDTOS = gameService.getFiveLastGamesByClubId(clubModel.get().getClubId());
            String logo = clubLinkRepository.findLogoById(clubModel.get().getClubId());
            return clubMapper.clubEntityToClubDTO(clubModel.get(),gameDTOS,logo);
        }else{
            return null;
        }
    }

    public JSONObject getStatisticsByClubId(Integer clubId, Integer season)  {
        JSONObject jsonObjectResponse = new JSONObject();
        String params = "?club_id=" + clubId + "&season=" + season;
        try{
            try{
                jsonObjectResponse.put("calculate-club-ranking",new JSONObject(String.valueOf(helperAPIService.callAPI("DATA", "/calculate-club-ranking" + params))));
            } catch (Exception e){
                jsonObjectResponse.put("calculate-club-ranking",new JSONObject());
            }
            try{
                jsonObjectResponse.put("calculate-wins", new JSONObject(String.valueOf(helperAPIService.callAPI("DATA", "/calculate-wins" + params))));
            } catch (Exception e){
                jsonObjectResponse.put("calculate-wins",new JSONObject());
            }try{
                jsonObjectResponse.put("calculate-losses", new JSONObject(String.valueOf(helperAPIService.callAPI("DATA", "/calculate-losses" + params))));
            } catch (Exception e){
                jsonObjectResponse.put("calculate-losses",new JSONObject());
            }
            try{
                jsonObjectResponse.put("calculate-form-last-5-matches", new JSONObject(String.valueOf(helperAPIService.callAPI("DATA", "/calculate-form-last-5-matches" + params))));
            } catch (Exception e){
                jsonObjectResponse.put("calculate-form-last-5-matches",new JSONObject());
            }
            try{
                jsonObjectResponse.put("calculate-yellow-cards", new JSONObject(String.valueOf(helperAPIService.callAPI("DATA", "/calculate-yellow-cards" + params))));
            } catch (Exception e){
                jsonObjectResponse.put("calculate-yellow-cards",new JSONObject());
            }
            try{
                jsonObjectResponse.put("calculate-average-yellow-cards-per-match", new JSONObject(String.valueOf(helperAPIService.callAPI("DATA", "/calculate-average-yellow-cards-per-match" + params))));
            } catch (Exception e){
                jsonObjectResponse.put("calculate-average-yellow-cards-per-match",new JSONObject());
            }
            try{
                jsonObjectResponse.put("calculate-red-cards", new JSONObject(String.valueOf(helperAPIService.callAPI("DATA", "/calculate-red-cards" + params))));
            } catch (Exception e){
                jsonObjectResponse.put("calculate-red-cards",new JSONObject());
            }
            try{
                jsonObjectResponse.put("calculate-red-cards-and-average", new JSONObject(String.valueOf(helperAPIService.callAPI("DATA", "/calculate-red-cards-and-average" + params))));
            } catch (Exception e){
                jsonObjectResponse.put("calculate-red-cards-and-average",new JSONObject());
            }
        } catch (JSONException e){
            return jsonObjectResponse;
        }
        return jsonObjectResponse;
    }

    public JSONObject getStatisticsGoalsByClubId(Integer clubId, Integer season)  {
        JSONObject jsonObjectResponse = new JSONObject();
        String params = "?club_id=" + clubId + "&season=" + season;
        try{
            try{
                jsonObjectResponse.put("calculate-goals-scored", new JSONObject(String.valueOf(helperAPIService.callAPI("DATA", "/calculate-goals-scored" + params))));
            } catch (Exception e){
                jsonObjectResponse.put("calculate-goals-scored",new JSONObject());
            }
            try{
                jsonObjectResponse.put("calculate-average-goals-scored", new JSONObject(String.valueOf(helperAPIService.callAPI("DATA", "/calculate-average-goals-scored" + params))));
            } catch (Exception e){
                jsonObjectResponse.put("calculate-average-goals-scored",new JSONObject());
            }
            try{
                jsonObjectResponse.put("calculate-total-goals-conceded", new JSONObject(String.valueOf(helperAPIService.callAPI("DATA", "/calculate-total-goals-conceded" + params))));
            } catch (Exception e){
                jsonObjectResponse.put("calculate-total-goals-conceded",new JSONObject());
            }
            try{
                jsonObjectResponse.put("calculate-goals-matches", new JSONObject(String.valueOf(helperAPIService.callAPI("DATA", "/calculate-goals-matches" + params))));
            } catch (Exception e){
                jsonObjectResponse.put("calculate-goals-matches",new JSONObject());
            }
            try{
                jsonObjectResponse.put("calculate-conceded-goals-matches", new JSONObject(String.valueOf(helperAPIService.callAPI("DATA", "/calculate-conceded-goals-matches" + params))));
            } catch (Exception e){
                jsonObjectResponse.put("calculate-conceded-goals-matches",new JSONObject());
            }
            try{
                jsonObjectResponse.put("calculate-average-minute-first-goal", new JSONObject(String.valueOf(helperAPIService.callAPI("DATA", "/calculate-average-minute-first-goal" + params))));
            } catch (Exception e){
                jsonObjectResponse.put("calculate-average-minute-first-goal",new JSONObject());
            }
        } catch (JSONException e){
            return jsonObjectResponse;
        }
        return jsonObjectResponse;
    }
}
