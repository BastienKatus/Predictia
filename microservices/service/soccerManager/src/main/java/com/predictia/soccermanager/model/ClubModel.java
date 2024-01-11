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
@Table(name = "clubs")
public class ClubModel {
    @Id
    @Column(name = "club_id")
    private Integer clubId;

    @Column(name = "name", length = Integer.MAX_VALUE)
    private String name;

    @Column(name = "domestic_competition_id", length = Integer.MAX_VALUE)
    private String domesticCompetitionId;

    @Column(name = "squad_size")
    private Integer squadSize;

    @Column(name = "stadium_name", length = Integer.MAX_VALUE)
    private String stadiumName;

    @Column(name = "stadium_seats")
    private Integer stadiumSeats;

    @Column(name = "coach_name", length = Integer.MAX_VALUE)
    private String coachName;

    @Column(name = "last_season")
    private Integer lastSeason;

    @Column(name = "url", length = Integer.MAX_VALUE)
    private String url;

}