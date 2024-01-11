package com.predictia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;

import java.io.Serializable;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompetitionDTO implements Serializable {
    String competitionId;
    String name;
    String subType;
    String type;
    String countryName;
    String domesticLeagueCode;
    String confederation;
    String url;
}