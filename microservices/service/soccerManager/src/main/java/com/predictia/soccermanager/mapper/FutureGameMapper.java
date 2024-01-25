package com.predictia.soccermanager.mapper;

import com.predictia.dto.FutureGameDTO;
import com.predictia.soccermanager.model.FutureGameModel;
import org.springframework.stereotype.Service;


@Service
public class FutureGameMapper {

    public FutureGameModel futurGameDTOToFuturGameEntity(FutureGameDTO dto){
        FutureGameModel fgm = new FutureGameModel();
        fgm.setId(dto.getId());
        fgm.setAwayClubId(dto.getAwayClubId());
        fgm.setAwayClubShortName(dto.getAwayClubShortName());
        fgm.setHomeClubId(dto.getHomeClubId());
        fgm.setHomeClubShortName(dto.getHomeClubShortName());
        fgm.setPredictionDraw(dto.getPredictionDraw());
        fgm.setPredictionWinHome(dto.getPredictionWinHome());
        fgm.setPredictionWinAway(dto.getPredictionWinAway());
        fgm.setStatus(dto.getStatus());
        fgm.setGameDate(dto.getGameDate());
        fgm.setAwayClubLogoUrl(dto.getAwayClubLogoUrl());
        fgm.setHomeClubLogoUrl(dto.getHomeClubLogoUrl());
        fgm.setId(dto.getId());
        fgm.setPredictionResultat(dto.getPredictionResultat());
        return fgm;
    }

    public FutureGameDTO futurGameEntityToFuturGameDTO(FutureGameModel futureGameModel){
        FutureGameDTO fgmDTO = new FutureGameDTO();
        fgmDTO.setId(futureGameModel.getId());
        fgmDTO.setAwayClubId(futureGameModel.getAwayClubId());
        fgmDTO.setAwayClubShortName(futureGameModel.getAwayClubShortName());
        fgmDTO.setHomeClubId(futureGameModel.getHomeClubId());
        fgmDTO.setHomeClubShortName(futureGameModel.getHomeClubShortName());
        fgmDTO.setPredictionDraw(futureGameModel.getPredictionDraw());
        fgmDTO.setPredictionWinHome(futureGameModel.getPredictionWinHome());
        fgmDTO.setPredictionWinAway(futureGameModel.getPredictionWinAway());
        fgmDTO.setStatus(futureGameModel.getStatus());
        fgmDTO.setAwayClubLogoUrl(futureGameModel.getAwayClubLogoUrl());
        fgmDTO.setHomeClubLogoUrl(futureGameModel.getHomeClubLogoUrl());
        fgmDTO.setGameDate(futureGameModel.getGameDate());
        fgmDTO.setPredictionResultat(futureGameModel.getPredictionResultat());
        return fgmDTO;
    }
}
