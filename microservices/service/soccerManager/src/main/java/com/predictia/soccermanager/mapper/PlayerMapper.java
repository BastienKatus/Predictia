package com.predictia.soccermanager.mapper;

import com.predictia.dto.PlayerDTO;
import com.predictia.soccermanager.model.PlayerModel;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class PlayerMapper {

    public PlayerDTO playerEntityToPlayerDTO(PlayerModel playerModel){

        PlayerDTO dto = new PlayerDTO();
        dto.setPlayerId(playerModel.getPlayerId());
        dto.setCurrentClubId(playerModel.getCurrentClubId());
        dto.setFoot(playerModel.getFoot());
        dto.setCityOfBirth(playerModel.getCityOfBirth());
        dto.setCountryOfBirth(playerModel.getCountryOfBirth());
        dto.setDateOfBirth(playerModel.getDateOfBirth());
        dto.setName(playerModel.getName());
        dto.setFirstName(playerModel.getFirstName());
        dto.setLastName(playerModel.getLastName());
        dto.setLastSeason(playerModel.getLastSeason());
        dto.setHeightInCm(playerModel.getHeightInCm());
        dto.setPosition(playerModel.getPosition());
        dto.setSubPosition(playerModel.getSubPosition());
        dto.setImageUrl(playerModel.getImageUrl());
        dto.setUrl(playerModel.getUrl());
        dto.setCurrentClubName(playerModel.getCurrentClubName());
        dto.setCountryOfCitizenship(playerModel.getCountryOfCitizenship());
        dto.setMarketValueInEur(playerModel.getMarketValueInEur());
        dto.setHighestMarketValueInEur(playerModel.getHighestMarketValueInEur());

        return dto;
    }

    public List<PlayerDTO> listPlayerEntityToPlayerDTO(List<PlayerModel> list){
        List<PlayerDTO> playerDTOList = new ArrayList<>();
        for (PlayerModel PlayerModel: list){
            playerDTOList.add(playerEntityToPlayerDTO(PlayerModel));
        }
        return playerDTOList;
    }
}
