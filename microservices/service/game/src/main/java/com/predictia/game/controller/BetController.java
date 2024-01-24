package com.predictia.game.controller;

import com.predictia.dto.BetDTO;
import com.predictia.game.service.BetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@CrossOrigin(origins = "", allowedHeaders = "")
@RequestMapping("/betgames")
public class BetController {

    @Autowired
    private BetService betService;

    @PostMapping("/bet")
    public BetDTO betAgainstPredictia(@RequestBody BetDTO betDTO) {
        return betService.betAgainstPredictia(betDTO);
    }

}
