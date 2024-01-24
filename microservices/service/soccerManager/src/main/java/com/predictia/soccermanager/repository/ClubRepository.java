package com.predictia.soccermanager.repository;

import com.predictia.soccermanager.model.ClubModel;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClubRepository extends CrudRepository<ClubModel,Integer> {

    @Query("SELECT c FROM ClubModel c WHERE c.lastSeason = :lastSeason AND c.domesticCompetitionId IN :competitionIds")
    Iterable<ClubModel> findClubsByLastSeasonAndCompetition(@Param("lastSeason") Integer lastSeason, @Param("competitionIds") List<String> competitionIds);

}
