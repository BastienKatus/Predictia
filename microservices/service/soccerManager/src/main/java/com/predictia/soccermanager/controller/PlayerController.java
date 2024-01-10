package com.predictia.soccermanager.controller;

import com.predictia.soccermanager.model.PlayerModel;
import com.predictia.soccermanager.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "", allowedHeaders = "")
@RequestMapping("/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @GetMapping()
    public Iterable<PlayerModel> getAll(){
        return playerService.getAllPlayers();
    }

    @GetMapping("/{id}")
    public Optional<PlayerModel> getById(@PathVariable("id") Integer id){
        return playerService.getPlayerById(id);
    }

}
