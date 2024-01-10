package com.predictia.soccermanager.service;

import com.predictia.soccermanager.model.GameModel;
import com.predictia.soccermanager.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    public Iterable<GameModel> getAllGames()  {
        return gameRepository.findAll();
    }

    public Optional<GameModel> getGameById(Integer id)  {
        return gameRepository.findById(id);
    }
}
