package com.predictia.soccermanager.controller;

import com.predictia.dto.CompetitionDTO;
import com.predictia.soccermanager.service.CompetitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "", allowedHeaders = "")
@RequestMapping("/competitions")
public class CompetitionController {

    @Autowired
    private CompetitionService competitionService;

    @GetMapping()
    public List<CompetitionDTO> getAll(){
        return competitionService.getAllCompetitions();
    }

    @GetMapping("/{id}")
    public CompetitionDTO getById(@PathVariable("id") Integer id){
        return competitionService.getCompetitionById(id);
    }
}
