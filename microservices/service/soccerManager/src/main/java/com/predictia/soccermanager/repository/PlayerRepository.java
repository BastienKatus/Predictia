package com.predictia.soccermanager.repository;

import com.predictia.soccermanager.model.PlayerModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerRepository extends CrudRepository<PlayerModel,Integer> {

    Iterable<PlayerModel> findAllByCurrentClubIdAndLastSeason(String currentCLubId, String lastSeason);
}
