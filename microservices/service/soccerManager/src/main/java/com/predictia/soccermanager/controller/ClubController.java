package com.predictia.soccermanager.controller;

import com.predictia.dto.ClubDTO;
import com.predictia.soccermanager.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "", allowedHeaders = "")
@RequestMapping("/clubs")
public class ClubController {

    @Autowired
    private ClubService clubService;

    @GetMapping()
    public List<ClubDTO> getAll(){
        return clubService.getAllClubs();
    }

    @GetMapping("/{id}")
    public ClubDTO getById(@PathVariable("id") Integer id){
        return clubService.getClubById(id);
    }


    @GetMapping("/statistics/{clubId}&{seasonId}")
    public JSONObject getStatisticsByClubId(@PathVariable("clubId") Integer clubId, Integer seasonId){
        return clubService.getStatisticsByClubId(clubId, seasonId);
    }
}
