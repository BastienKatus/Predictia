package com.predictia.soccermanager.controller;

import com.predictia.dto.ClubDTO;
import com.predictia.soccermanager.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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


    @GetMapping("/statistics")
    public String getStatisticsByClubIdAndSeason(@RequestParam("clubId") Integer clubId, @RequestParam("season") Integer season) throws JSONException {
        return clubService.getStatisticsByClubId(clubId, season).toString();
    }

    @GetMapping("/statistics/{clubId}")
    public String getStatisticsByClubId(@PathVariable("clubId") Integer clubId){
        return clubService.getStatisticsByClubId(clubId, LocalDate.now().getYear()).toString();
    }

    @GetMapping("/statistics_goals")
    public String getStatisticsGoalsByClubIdAndSeason(@RequestParam("clubId") Integer clubId, @RequestParam("season") Integer season) throws JSONException {
        return clubService.getStatisticsGoalsByClubId(clubId, season).toString();
    }

    @GetMapping("/statistics_goals/{clubId}")
    public String getStatisticsGoalsByClubId(@PathVariable("clubId") Integer clubId){
        return clubService.getStatisticsGoalsByClubId(clubId, LocalDate.now().getYear()).toString();
    }
}
