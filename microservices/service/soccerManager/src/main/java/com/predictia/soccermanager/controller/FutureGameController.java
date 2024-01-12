package com.predictia.soccermanager.controller;

import com.predictia.dto.FutureGameDTO;
import com.predictia.soccermanager.service.FutureGameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.format.annotation.DateTimeFormat;


import java.io.IOException;
import java.time.LocalDate;
import java.util.List;


@RestController
@CrossOrigin(origins = "", allowedHeaders = "")
@RequestMapping("/nextgames")
public class FutureGameController {

    @Autowired
    private FutureGameService futureGameService;
    @GetMapping("/getAllNextGamesInRange")
    public List<FutureGameDTO> getAllNextGamesInRange(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate)
            throws IOException, InterruptedException, JSONException {
        return futureGameService.getAllRangeWeekMatch(startDate, endDate);
    }

    @GetMapping("/getTodaysNextGames")
    public List<FutureGameDTO> getAllTodaysNextGames() throws IOException, InterruptedException, JSONException {
        return futureGameService.getAllRangeWeekMatch(LocalDate.now(), LocalDate.now());
    }
}
