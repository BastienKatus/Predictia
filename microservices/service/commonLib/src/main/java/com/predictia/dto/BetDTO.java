package com.predictia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BetDTO {
    private Long userId;
    private Integer clubHomeId;
    private Integer clubAwayId;
    private Float betWinHomeClub;
    private Float betWinAwayClub;
    private Float betDraw;
    private Float bet;
    private Float prize;

    private Float predictionResultWinHomeClub;
    private Float predictionResultWinAwayClub;
    private Float predictionResultDraw;
}
