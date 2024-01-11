package com.predictia.soccermanager.mapper;

import com.predictia.dto.CompetitionDTO;
import com.predictia.dto.GameDTO;
import com.predictia.soccermanager.model.CompetitionModel;
import com.predictia.soccermanager.model.GameModel;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CompetitionMapper {

    public CompetitionDTO competitionEntityToCompetitionDTO(CompetitionModel competitionModel){
        CompetitionDTO dto = new CompetitionDTO();
        dto.setCompetitionId(competitionModel.getCompetitionId());
        dto.setName(competitionModel.getName());
        dto.setConfederation(competitionModel.getConfederation());
        dto.setType(competitionModel.getType());
        dto.setUrl(competitionModel.getUrl());
        dto.setCountryName(competitionModel.getCountryName());
        dto.setDomesticLeagueCode(competitionModel.getDomesticLeagueCode());
        dto.setSubType(competitionModel.getSubType());
        
        return dto;
    }

    public List<CompetitionDTO> listCompetitionEntityToCompetitionDTO(List<CompetitionModel> list){
        List<CompetitionDTO> competitionDTOList = new ArrayList<>();
        for (CompetitionModel CompetitionModel: list){
            competitionDTOList.add(competitionEntityToCompetitionDTO(CompetitionModel));
        }
        return competitionDTOList;
    }
}
