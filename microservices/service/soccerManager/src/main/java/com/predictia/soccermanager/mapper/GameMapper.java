package com.predictia.soccermanager.mapper;


import com.predictia.dto.GameDTO;
import com.predictia.soccermanager.model.GameModel;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;


@Service
public class GameMapper {

    public GameDTO gameEntityToGameDTO(GameModel gameModel){

        GameDTO dto = new GameDTO();
        dto.setGameId(gameModel.getGameId());
        dto.setAttendance(gameModel.getAttendance());
        dto.setAggregate(gameModel.getAggregate());
        dto.setDate(gameModel.getDate());
        dto.setHomeClubId(gameModel.getHomeClubId());
        dto.setHomeClubName(gameModel.getHomeClubName());
        dto.setHomeClubGoals(gameModel.getHomeClubGoals());
        dto.setHomeClubPosition(gameModel.getHomeClubPosition());
        dto.setHomeClubManagerName(gameModel.getHomeClubManagerName());
        dto.setAwayClubId(gameModel.getAwayClubId());
        dto.setAwayClubGoals(gameModel.getAwayClubGoals());
        dto.setAwayClubName(gameModel.getAwayClubName());
        dto.setAwayClubManagerName(gameModel.getAwayClubManagerName());
        dto.setAwayClubPosition(gameModel.getAwayClubPosition());
        dto.setRound(gameModel.getRound());
        dto.setReferee(gameModel.getReferee());
        dto.setSeason(gameModel.getSeason());
        dto.setStadium(gameModel.getStadium());
        dto.setUrl(gameModel.getUrl());
        dto.setCompetitionId(gameModel.getCompetitionId());
        dto.setCompetitionType(gameModel.getCompetitionType());

        return dto;
    }

    public List<GameDTO> listGameEntityToGameDTO(List<GameModel> list){
        List<GameDTO> gameDTOList = new ArrayList<>();
        for (GameModel GameModel: list){
            gameDTOList.add(gameEntityToGameDTO(GameModel));
        }
        return gameDTOList;
    }
}
