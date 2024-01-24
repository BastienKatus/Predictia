package com.predictia.user.repository;

import com.predictia.user.model.FollowedTeamsModel;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface FollowedTeamsRepository extends CrudRepository<FollowedTeamsModel, Integer> {

    List<FollowedTeamsModel> findAllByIdUser(Integer userId);
}
