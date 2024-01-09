package com.predictia.soccermanager.repository;

import com.predictia.soccermanager.model.ClubModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRepository extends CrudRepository<ClubModel,Integer> {
}
