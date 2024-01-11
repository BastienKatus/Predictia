package com.predictia.soccermanager.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Entity
@Table(name = "games")
public class GameModel {
    @Id
    @Column(name = "game_id")
    private Integer gameId;

    @Column(name = "competition_id", length = Integer.MAX_VALUE)
    private String competitionId;

    @Column(name = "season")
    private Integer season;

    @Column(name = "round", length = Integer.MAX_VALUE)
    private String round;

    @Column(name = "date", length = Integer.MAX_VALUE)
    private String date;

    @Column(name = "home_club_id")
    private Integer homeClubId;

    @Column(name = "away_club_id")
    private Integer awayClubId;

    @Column(name = "home_club_goals")
    private Integer homeClubGoals;

    @Column(name = "away_club_goals")
    private Integer awayClubGoals;

    @Column(name = "home_club_position")
    private Integer homeClubPosition;

    @Column(name = "away_club_position")
    private Integer awayClubPosition;

    @Column(name = "home_club_manager_name", length = Integer.MAX_VALUE)
    private String homeClubManagerName;

    @Column(name = "away_club_manager_name", length = Integer.MAX_VALUE)
    private String awayClubManagerName;

    @Column(name = "stadium", length = Integer.MAX_VALUE)
    private String stadium;

    @Column(name = "attendance")
    private Integer attendance;

    @Column(name = "referee", length = Integer.MAX_VALUE)
    private String referee;

    @Column(name = "url", length = Integer.MAX_VALUE)
    private String url;

    @Column(name = "home_club_name", length = Integer.MAX_VALUE)
    private String homeClubName;

    @Column(name = "away_club_name", length = Integer.MAX_VALUE)
    private String awayClubName;

    @Column(name = "aggregate", length = Integer.MAX_VALUE)
    private String aggregate;

    @Column(name = "competition_type", length = Integer.MAX_VALUE)
    private String competitionType;

}