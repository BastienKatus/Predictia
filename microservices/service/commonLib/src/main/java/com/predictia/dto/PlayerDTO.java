package com.predictia.dto;

import lombok.Value;

import java.io.Serializable;

@Value
public class PlayerDTO implements Serializable {
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
    String currentClubName;
    Integer marketValueInEur;
    Integer highestMarketValueInEur;
}