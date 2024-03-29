package com.predictia.soccermanager.service;

import com.predictia.dto.ClubDTO;
import com.predictia.dto.PlayerDTO;
import com.predictia.soccermanager.mapper.PlayerMapper;
import com.predictia.soccermanager.model.ClubModel;
import com.predictia.soccermanager.model.PlayerModel;
import com.predictia.soccermanager.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private PlayerMapper playerMapper;

    public List<PlayerDTO> getAllPlayers()  {
        Iterable<PlayerModel> playerModels =  playerRepository.findAll();
        List<PlayerModel> playerModelList = new ArrayList<>();
        playerModels.forEach(playerModelList::add);
        return new ArrayList<>(playerMapper.listPlayerEntityToPlayerDTO(playerModelList));

    }

    public PlayerDTO getPlayerById(Integer id)  {
        Optional<PlayerModel> playerModel = playerRepository.findById(id);
        return playerModel.map(model -> playerMapper.playerEntityToPlayerDTO(model)).orElse(null);
    }

    public List<PlayerDTO> getAllPlayersFromClub(Integer id)  {
        Calendar c = Calendar.getInstance();
        int year = c.get(Calendar.YEAR);
        Iterable<PlayerModel> playerModels =  playerRepository.findAllByCurrentClubIdAndLastSeason(id, year);
        int tailleIterable = 0;
        for (PlayerModel ignored : playerModels) {
            tailleIterable++;
        }
        while(tailleIterable==0){
            year = year-1;
            playerModels =  playerRepository.findAllByCurrentClubIdAndLastSeason(id, year);
            for (PlayerModel ignored : playerModels) {
                tailleIterable++;
            }
        }
        List<PlayerModel> playerModelList = new ArrayList<>();
        playerModels.forEach(playerModelList::add);
        return new ArrayList<>(playerMapper.listPlayerEntityToPlayerDTO(playerModelList));
    }

    public List<PlayerDTO> searchPlayersByName(String name) {
        Iterable<PlayerModel> playerModels = playerRepository.findAll();
        List<PlayerModel> matchingPlayers = new ArrayList<>();

        playerModels.forEach(playerModel -> {
            if ((playerModel.getName() != null && playerModel.getName().toLowerCase().contains(name.toLowerCase()))
                    || (playerModel.getFirstName() != null && playerModel.getFirstName().toLowerCase().contains(name.toLowerCase()))
                    || (playerModel.getLastName() != null && playerModel.getLastName().toLowerCase().contains(name.toLowerCase()))) {
                matchingPlayers.add(playerModel);
            }
        });

        return matchingPlayers.stream()
                .map(playerModel -> playerMapper.playerEntityToPlayerDTO(playerModel))
                .collect(Collectors.toList());
    }
}
