package com.predictia.soccermanager.repository;

import com.predictia.soccermanager.model.CompetitionModel;
import org.springframework.data.repository.CrudRepository;

public interface CompetitionRepository extends CrudRepository<CompetitionModel, Integer> {

    Iterable<CompetitionModel> findAllByType(String league);

}
