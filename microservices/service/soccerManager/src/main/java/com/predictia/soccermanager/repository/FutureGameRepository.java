package com.predictia.soccermanager.repository;

import com.predictia.soccermanager.model.FutureGameModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FutureGameRepository extends CrudRepository<FutureGameModel, Integer> {
    FutureGameModel findFutureGameModelByHomeClubShortNameAndAwayClubShortName(@Param("homeClubShortName") String homeClubShortName,@Param("awayClubShortName") String awayClubShortName);
}
