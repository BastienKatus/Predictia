package com.predictia.soccermanager.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "competitions")
public class CompetitionModel {
    @Id
    @Column(name = "competition_id", length = Integer.MAX_VALUE)
    private String competitionId;

    @Column(name = "name", length = Integer.MAX_VALUE)
    private String name;

    @Column(name = "sub_type", length = Integer.MAX_VALUE)
    private String subType;

    @Column(name = "type", length = Integer.MAX_VALUE)
    private String type;

    @Column(name = "country_name", length = Integer.MAX_VALUE)
    private String countryName;

    @Column(name = "domestic_league_code", length = Integer.MAX_VALUE)
    private String domesticLeagueCode;

    @Column(name = "confederation", length = Integer.MAX_VALUE)
    private String confederation;

    @Column(name = "url", length = Integer.MAX_VALUE)
    private String url;

}