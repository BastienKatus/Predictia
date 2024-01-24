package com.predictia.soccermanager.repository;

import com.predictia.soccermanager.model.FutureGameModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FutureGameRepository extends CrudRepository<FutureGameModel, Integer> {
    FutureGameModel findFutureGameModelByHomeClubShortNameAndAwayClubShortName(@Param("homeClubShortName") String homeClubShortName,@Param("awayClubShortName") String awayClubShortName);
    FutureGameModel findFutureGameModelByHomeClubShortNameAndAwayClubShortNameAndGameDate(@Param("homeClubShortName") String homeClubShortName,@Param("awayClubShortName") String awayClubShortName, @Param("game_date") LocalDate gameDate);
    List<FutureGameModel> findAllByModifiedDateVerification(@Param("modified_date_verification") LocalDate modifiedDateVerification);
    
}
