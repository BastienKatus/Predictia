package com.predictia.soccermanager.service;

import com.predictia.dto.ClubDTO;
import com.predictia.soccermanager.mapper.ClubMapper;
import com.predictia.soccermanager.model.ClubModel;
import com.predictia.soccermanager.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private ClubMapper clubMapper;

    public List<ClubDTO> getAllClubs()  {
        Iterable<ClubModel> clubModels =  clubRepository.findAll();
        List<ClubModel> clubModelList = new ArrayList<>();
        clubModels.forEach(clubModelList::add);
        return new ArrayList<>(clubMapper.listClubEntityToClubDTO(clubModelList));

    }

    public ClubDTO getClubById(Integer id)  {
        Optional<ClubModel> clubModel = clubRepository.findById(id);
        return clubModel.map(model -> clubMapper.clubEntityToClubDTO(model)).orElse(null);
    }
}
