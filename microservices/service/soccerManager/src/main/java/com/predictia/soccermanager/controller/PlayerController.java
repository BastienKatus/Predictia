package com.predictia.soccermanager.controller;

import com.predictia.dto.PlayerDTO;
import com.predictia.soccermanager.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "", allowedHeaders = "")
@RequestMapping("/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @GetMapping()
    public List<PlayerDTO> getAll(){
        return playerService.getAllPlayers();
    }

    @GetMapping("/{id}")
    public PlayerDTO getById(@PathVariable("id") Integer id){
        return playerService.getPlayerById(id);
    }

    @GetMapping("/club/{id}")
    public List<PlayerDTO> getAllPlayersFromClub(@PathVariable("id") Integer id){
        return playerService.getAllPlayersFromClub(id);
    }

}
