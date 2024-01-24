package com.predictia.soccermanager.mapper;

import com.predictia.dto.ClubDTO;
import com.predictia.dto.GameDTO;
import com.predictia.soccermanager.model.ClubModel;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClubMapper {

    public ClubDTO clubEntityToClubDTO(ClubModel clubModel, List<GameDTO> list, String logo) {

        ClubDTO dto = new ClubDTO();
        dto.setClubId(clubModel.getClubId());
        dto.setName(clubModel.getName());
        dto.setCoachName(clubModel.getCoachName());
        dto.setUrl(clubModel.getUrl());
        dto.setLastSeason(clubModel.getLastSeason());
        dto.setStadiumName(clubModel.getStadiumName());
        dto.setSquadSize(clubModel.getSquadSize());
        dto.setStadiumSeats(clubModel.getStadiumSeats());
        dto.setDomesticCompetitionId(clubModel.getDomesticCompetitionId());
        dto.setUrl_logo(logo);
        if(list!=null && !list.isEmpty()){
            dto.setGamesList(list);
        }
        return dto;
    }

    public List<ClubDTO> listClubEntityToClubDTO(List<ClubModel> list){
        List<ClubDTO> clubDTOList = new ArrayList<>();
        for (ClubModel clubModel: list){
            clubDTOList.add(clubEntityToClubDTO(clubModel,null,null));
        }
        return clubDTOList;
    }
}
