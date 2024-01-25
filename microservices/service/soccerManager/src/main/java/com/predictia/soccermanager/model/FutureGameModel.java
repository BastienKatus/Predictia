package com.predictia.soccermanager.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

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

    @Column(name="home_club_logo_url")
    private String homeClubLogoUrl;

    @Column(name="away_club_logo_url")
    private String awayClubLogoUrl;

    @Column(name="status")
    private String status;

    @Column(name="game_date")
    private LocalDate gameDate;

    @Column(name="modified_date_verification")
    private LocalDate modifiedDateVerification;

    @Column(name="prediction_win_home")
    private Float predictionWinHome;

    @Column(name="prediction_win_away")
    private Float predictionWinAway;

    @Column(name="prediction_draw")
    private Float predictionDraw;

    @Column(name="prediction_resultat")
    private Integer predictionResultat;
}
