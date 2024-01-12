package com.predictia.soccermanager.service;

import com.predictia.dto.GameDTO;
import com.predictia.soccermanager.mapper.GameMapper;
import com.predictia.soccermanager.model.GameModel;
import com.predictia.soccermanager.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
}
