package com.predictia.soccermanager.repository;

import com.predictia.soccermanager.model.GameModel;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends CrudRepository<GameModel,Integer> {

    @Query("SELECT g FROM GameModel g WHERE (g.homeClubId = :clubId OR g.awayClubId = :clubId) AND g.competitionType = 'domestic_league' ORDER BY g.date DESC LIMIT 5")
    List<GameModel> findTop5ByClubIdOrderByGameDateDesc(@Param("clubId") Integer clubId);

}
