package com.predictia.soccermanager.repository;

import com.predictia.soccermanager.model.ClubLinkModel;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClubLinkRepository extends CrudRepository<ClubLinkModel,Integer> {

    Optional<ClubLinkModel> findOneByIdSoccerManager(@Param("id_soccer_manager") Integer idSoccerManager);

    @Query("SELECT c.logo FROM ClubLinkModel c WHERE c.idSoccerManager = :clubId")
    String findLogoById(@Param("clubId") Integer clubId);
}
