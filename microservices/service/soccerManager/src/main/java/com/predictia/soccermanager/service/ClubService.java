package com.predictia.soccermanager.service;

import com.predictia.soccermanager.model.ClubModel;
import com.predictia.soccermanager.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    public Iterable<ClubModel> getAllClubs()  {
        return clubRepository.findAll();
    }

    public Optional<ClubModel> getClubById(Integer id)  {
        return clubRepository.findById(id);
    }
}
