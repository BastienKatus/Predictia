package com.predictia.soccermanager.controller;

import com.predictia.dto.FutureGameDTO;
import com.predictia.soccermanager.service.FutureGameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;


@RestController
@CrossOrigin(origins = "", allowedHeaders = "")
@RequestMapping("/fgc")
public class FutureGameController {

    @Autowired
    private FutureGameService futureGameService;
    @GetMapping()
    public List<FutureGameDTO> getRangeDateFutureGames() throws IOException, InterruptedException, JSONException {
        return futureGameService.getRangeDateFutureGames(null, null);
    }
}
