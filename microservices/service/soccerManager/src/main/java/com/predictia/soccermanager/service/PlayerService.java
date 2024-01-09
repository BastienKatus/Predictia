package com.predictia.soccermanager.service;

import com.predictia.soccermanager.model.ClubModel;
import com.predictia.soccermanager.model.PlayerModel;
import com.predictia.soccermanager.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    public Iterable<PlayerModel> getAllPlayers()  {
        return playerRepository.findAll();
    }

    public Optional<PlayerModel> getPlayerById(Integer id)  {
        return playerRepository.findById(id);
    }
}
