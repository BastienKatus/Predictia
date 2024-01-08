package com.predictia.soccermanager.mapper;

import com.predictia.dto.FutureGameDTO;
import com.predictia.soccermanager.model.FutureGameModel;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class FutureGameMapper {

    public FutureGameModel futurGameDTOToFuturGameEntity(FutureGameDTO dto){
        FutureGameModel fgm = new FutureGameModel();
        fgm.setId(dto.getId());
        fgm.setAwayClubId(dto.getAwayClubId());
        fgm.setAwayClubShortName(dto.getAwayClubShortName());
        fgm.setHomeClubId(dto.getHomeClubId());
        fgm.setHomeClubShortName(dto.getHomeClubShortName());
        fgm.setPrediction(dto.getPrediction());
        fgm.setId(dto.getId());
        return fgm;
    }

    public FutureGameDTO futurGameEntityToFuturGameDTO(FutureGameModel futureGameModel){
        FutureGameDTO fgmDTO = new FutureGameDTO();
        fgmDTO.setId(futureGameModel.getId());
        fgmDTO.setAwayClubId(futureGameModel.getAwayClubId());
        fgmDTO.setAwayClubShortName(futureGameModel.getAwayClubShortName());
        fgmDTO.setHomeClubId(futureGameModel.getHomeClubId());
        fgmDTO.setHomeClubShortName(futureGameModel.getHomeClubShortName());
        fgmDTO.setPrediction(futureGameModel.getPrediction());
        fgmDTO.setId(futureGameModel.getId());
        return fgmDTO;
    }
}
