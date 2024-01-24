package com.predictia.soccermanager.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "clubs_link_api")
public class ClubLinkModel {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "short_name")
    private String shortName;

    @Column(name = "tla")
    private String tla;

    @Column(name = "league_code")
    private String leagueCode;

    @Column(name = "league_name")
    private String leagueName;

    @Column(name = "logo")
    private String logo;

    @Column(name = "id_soccer_manager")
    private Integer idSoccerManager;
}