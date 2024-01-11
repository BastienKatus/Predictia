package com.predictia.user.repository;

import com.predictia.user.model.FollowedTeamsModel;
import com.predictia.user.model.UserModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface FollowedTeamsRepository extends CrudRepository<FollowedTeamsModel, Integer> {

    List<FollowedTeamsModel> findAllByIdUser(Integer userId);

    void deleteAllByIdUser(Integer userId);

}
