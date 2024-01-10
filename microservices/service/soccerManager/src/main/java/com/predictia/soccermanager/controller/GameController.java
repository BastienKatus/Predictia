package com.predictia.soccermanager.controller;

import com.predictia.soccermanager.model.GameModel;
import com.predictia.soccermanager.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "", allowedHeaders = "")
@RequestMapping("/games")
public class GameController {

    @Autowired
    private GameService gameService;

    @GetMapping()
    public Iterable<GameModel> getAll(){
        return gameService.getAllGames();
    }

    @GetMapping("/{id}")
    public Optional<GameModel> getById(@PathVariable("id") Integer id){
        return gameService.getGameById(id);
    }

}
