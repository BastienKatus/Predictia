package com.predictia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerDTO{
    Integer playerId;
    String firstName;
    String lastName;
    String name;
    Integer lastSeason;
    Integer currentClubId;
    String countryOfBirth;
    String cityOfBirth;
    String countryOfCitizenship;
    String dateOfBirth;
    String subPosition;
    String position;
    String foot;
    Integer heightInCm;
    String url;
    String imageUrl;
    String currentClubName;
    Integer marketValueInEur;
    Integer highestMarketValueInEur;
}