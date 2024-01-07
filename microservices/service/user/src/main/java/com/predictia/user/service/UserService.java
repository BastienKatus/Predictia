package com.predictia.user.service;

import com.predictia.dto.UserDTO;
import com.predictia.user.mapper.UserMapper;
import com.predictia.user.model.UserModel;
import com.predictia.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;


    public Iterable<UserModel> getAllUser()  {
        return userRepository.findAll();
    }

    public Optional<UserModel> getUserById(Integer id)  {
        return userRepository.findById(id);
    }

    public UserModel getUserByUsernameAndPassword(String u, String p )  {
        return userRepository.findByUsernameAndPassword(u,p);
    }
    @Transactional
    public UserModel createOrUpdate(UserDTO userDTO) {
        UserModel userModel = userMapper.userDTOToUserEntity(userDTO);
        userRepository.save(userModel);
        return userModel;
    }

    public void deleteById(Integer id) {
        userRepository.deleteById(id);
    }

    public void deleteAll(){
        userRepository.deleteAll();
    }
}
