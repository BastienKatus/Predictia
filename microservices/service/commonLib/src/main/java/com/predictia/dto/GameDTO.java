package com.predictia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameDTO implements Serializable {
    Integer gameId;
    String competitionId;
    Integer season;
    String round;
    String date;
    Integer homeClubId;
    Integer awayClubId;
    Integer homeClubGoals;
    Integer awayClubGoals;
    Integer homeClubPosition;
    Integer awayClubPosition;
    String homeClubManagerName;
    String awayClubManagerName;
    String stadium;
    Integer attendance;
    String referee;
    String url;
    String homeClubName;
    String awayClubName;
    String aggregate;
    String competitionType;
}