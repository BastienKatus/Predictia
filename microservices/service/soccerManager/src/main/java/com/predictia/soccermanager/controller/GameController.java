package com.predictia.soccermanager.controller;

import com.predictia.dto.GameDTO;
import com.predictia.soccermanager.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = "", allowedHeaders = "")
@RequestMapping("/games")
public class GameController {

    @Autowired
    private GameService gameService;

    @GetMapping()
    public List<GameDTO> getAll(){
        return gameService.getAllGames();
    }

    @GetMapping("/{id}")
    public GameDTO getById(@PathVariable("id") Integer id){
        return gameService.getGameById(id);
    }

}
