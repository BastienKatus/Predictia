package com.predictia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Integer id;
    private String username;
    private String password;
    private String firstname;
    private String lastname;
    private String mail;
    private Date birthdate;
    private BigDecimal credits;
    private Integer favoriteClubId;
}
