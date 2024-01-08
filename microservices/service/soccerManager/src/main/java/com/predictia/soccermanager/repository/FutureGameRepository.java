package com.predictia.soccermanager.repository;

import com.predictia.soccermanager.model.FutureGameModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FutureGameRepository extends CrudRepository<FutureGameModel, Integer> {
}
