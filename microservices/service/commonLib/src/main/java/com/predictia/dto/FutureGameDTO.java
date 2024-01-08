package com.predictia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FutureGameDTO {
    private Integer id;
    private Integer homeClubId;
    private String homeClubShortName;
    private Integer awayClubId;
    private String awayClubShortName;
    private Double prediction;
}
