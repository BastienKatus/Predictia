package com.predictia.user.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "followed_teams_link")
public class FollowedTeamsModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name="id_user", nullable = false)
    private Integer idUser;

    @Column(name="id_team", nullable = false)
    private Integer idTeam;

}
