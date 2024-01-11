package com.predictia.user.service;

import com.predictia.dto.UserDTO;
import com.predictia.user.mapper.UserMapper;
import com.predictia.user.model.UserModel;
import com.predictia.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;


    public List<UserDTO> getAllUsers()  {
        Iterable<UserModel> userModels =  userRepository.findAll();
        List<UserModel> userModelList = new ArrayList<>();
        userModels.forEach(userModelList::add);
        return new ArrayList<>(userMapper.listUserEntityToUserDTO(userModelList));

    }

    public UserDTO getUserById(Integer id)  {
        Optional<UserModel> userModel = userRepository.findById(id);
        return userModel.map(model -> userMapper.userEntityToUserDTO(model)).orElse(null);
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
