package com.predictia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubDTO{
    Integer clubId;
    String name;
    String domesticCompetitionId;
    Integer squadSize;
    String stadiumName;
    Integer stadiumSeats;
    String coachName;
    Integer lastSeason;
    String url;
    String url_logo;
    List<GameDTO> gamesList;
}