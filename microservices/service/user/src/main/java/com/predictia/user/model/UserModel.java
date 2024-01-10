package com.predictia.user.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user-predictia")
public class UserModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name="username", nullable = false)
    private String username;

    @Column(name="password", nullable = false)
    private String password;

    @Column(name="firstname", nullable = false)
    private String firstname;

    @Column(name="lastname", nullable = false)
    private String lastname;

    @Column(name="mail", nullable = false)
    private String mail;

    @Column(name="credits")
    private Double credits;

    @Column(name="favoriteclubid")
    private Integer favoriteClubId;
}
