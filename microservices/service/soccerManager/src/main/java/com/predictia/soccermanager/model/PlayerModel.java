package com.predictia.soccermanager.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "players")
public class PlayerModel {
    @Id
    @Column(name = "player_id")
    private Integer playerId;

    @Column(name = "first_name", length = Integer.MAX_VALUE)
    private String firstName;

    @Column(name = "last_name", length = Integer.MAX_VALUE)
    private String lastName;

    @Column(name = "name", length = Integer.MAX_VALUE)
    private String name;

    @Column(name = "last_season")
    private Integer lastSeason;

    @Column(name = "current_club_id")
    private Integer currentClubId;

    @Column(name = "country_of_birth", length = Integer.MAX_VALUE)
    private String countryOfBirth;

    @Column(name = "city_of_birth", length = Integer.MAX_VALUE)
    private String cityOfBirth;

    @Column(name = "country_of_citizenship", length = Integer.MAX_VALUE)
    private String countryOfCitizenship;

    @Column(name = "date_of_birth", length = Integer.MAX_VALUE)
    private String dateOfBirth;

    @Column(name = "sub_position", length = Integer.MAX_VALUE)
    private String subPosition;

    @Column(name = "\"position\"", length = Integer.MAX_VALUE)
    private String position;

    @Column(name = "foot", length = Integer.MAX_VALUE)
    private String foot;

    @Column(name = "height_in_cm")
    private Integer heightInCm;

    @Column(name = "url", length = Integer.MAX_VALUE)
    private String url;

    @Column(name = "image_url", length = Integer.MAX_VALUE)
    private String imageUrl;

    @Column(name = "current_club_name", length = Integer.MAX_VALUE)
    private String currentClubName;

    @Column(name = "market_value_in_eur")
    private Integer marketValueInEur;

    @Column(name = "highest_market_value_in_eur")
    private Integer highestMarketValueInEur;

}