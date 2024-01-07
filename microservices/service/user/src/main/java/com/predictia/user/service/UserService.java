package com.predictia.user.service;

import com.predictia.dto.UserDTO;
import com.predictia.user.mapper.UserMapper;
import com.predictia.user.model.User;
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


    public Iterable<User> getAllUser()  {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id)  {
        return userRepository.findById(id);
    }

    public User getUserByUsernameAndPassword(String u, String p )  {
        return userRepository.findByUsernameAndPassword(u,p);
    }
    @Transactional
    public void addUser(UserDTO userDTO) {
        User user = userMapper.dtoToEntity(userDTO);
        userRepository.save(user);
    }

    public void deleteAll(){
        userRepository.deleteAll();
    }
}
