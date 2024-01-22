package com.predictia.soccermanager.service;

import com.predictia.dto.GameDTO;
import com.predictia.soccermanager.mapper.GameMapper;
import com.predictia.soccermanager.model.GameModel;
import com.predictia.soccermanager.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GameMapper gameMapper;

    @Autowired
    private HelperAPIService helperAPIService;

    public List<GameDTO> getAllGames()  {
        Iterable<GameModel> gameModels =  gameRepository.findAll();
        List<GameModel> gameModelList = new ArrayList<>();
        gameModels.forEach(gameModelList::add);
        return new ArrayList<>(gameMapper.listGameEntityToGameDTO(gameModelList));

    }

    public GameDTO getGameById(Integer id)  {
        Optional<GameModel> gameModel = gameRepository.findById(id);
        return gameModel.map(model -> gameMapper.gameEntityToGameDTO(model)).orElse(null);
    }

    public List<GameDTO> getFiveLastGamesByClubId(Integer clubId){
        Iterable<GameModel> gameModels =  gameRepository.findTop5ByClubIdOrderByGameDateDesc(clubId);
        List<GameModel> gameModelList = new ArrayList<>();
        gameModels.forEach(gameModelList::add);
        return new ArrayList<>(gameMapper.listGameEntityToGameDTO(gameModelList));
    }

    public JSONObject getPrediction(Integer homeTeamId, Integer awayTeamId){
        return helperAPIService.callAPI("DATA", "/predict?home_team_id=" + homeTeamId + "&away_team_id=" + awayTeamId);
    }
}
