package com.predictia.soccermanager.model;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "next_games")
public class FutureGameModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="next_game_id")
    private Integer id;

    @Column(name="home_club_id")
    private Integer homeClubId;

    @Column(name="home_club_short_name")
    private String homeClubShortName;

    @Column(name="away_club_id")
    private Integer awayClubId;

    @Column(name="away_club_short_name")
    private String awayClubShortName;

    @Column(name="prediction")
    private Double prediction;
}
