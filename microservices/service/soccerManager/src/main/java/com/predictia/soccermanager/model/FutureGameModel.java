package com.predictia.soccermanager.model;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "soccermanager-predictia")
public class FutureGameModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name="homeclubid")
    private Integer homeClubId;

    @Column(name="homeclubshortname")
    private String homeClubShortName;

    @Column(name="awayclubid")
    private Integer awayClubId;

    @Column(name="awayclubshortname")
    private String awayClubShortName;

    @Column(name="prrediction")
    private Double prediction;
}
