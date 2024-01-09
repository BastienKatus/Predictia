package com.predictia.soccermanager.controller;

import com.predictia.soccermanager.model.ClubModel;
import com.predictia.soccermanager.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "", allowedHeaders = "")
@RequestMapping("/clubs")
public class ClubController {

    @Autowired
    private ClubService clubService;

    @GetMapping()
    public Iterable<ClubModel> getAll(){
        return clubService.getAllClubs();
    }

    @GetMapping("/{id}")
    public Optional<ClubModel> getById(@PathVariable("id") Integer id){
        return clubService.getClubById(id);
    }

}
