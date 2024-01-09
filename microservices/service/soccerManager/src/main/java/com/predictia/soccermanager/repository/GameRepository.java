package com.predictia.soccermanager.repository;

import com.predictia.soccermanager.model.GameModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends CrudRepository<GameModel,Integer> {
}
