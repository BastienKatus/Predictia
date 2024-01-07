package com.predictia.user.repository;

import com.predictia.user.model.UserModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<UserModel, Integer> {
    UserModel findByUsernameAndPassword(String username, String password);
}
