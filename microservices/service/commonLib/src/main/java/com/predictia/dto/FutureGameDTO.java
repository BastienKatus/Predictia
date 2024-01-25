package com.predictia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FutureGameDTO {
    private Integer id;
    private Integer homeClubId;
    private String homeClubShortName;
    private Integer awayClubId;
    private String awayClubShortName;
    private String homeClubLogoUrl;
    private String awayClubLogoUrl;
    private String status;
    private LocalDate gameDate;
    private Float predictionWinHome;
    private Float predictionWinAway;
    private Float predictionDraw;

    private Integer predictionResultat;
}
