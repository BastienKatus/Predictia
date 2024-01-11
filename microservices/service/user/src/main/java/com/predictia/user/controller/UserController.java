package com.predictia.user.controller;

import com.predictia.dto.AuthDTO;
import com.predictia.dto.UserDTO;
import com.predictia.user.mapper.UserMapper;
import com.predictia.user.model.UserModel;
import com.predictia.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "", allowedHeaders = "")
@RequestMapping("/")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @GetMapping()
    public List<UserDTO> getAll(){
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserDTO getById(@PathVariable("id") Integer id){
        return userService.getUserById(id);
    }

    @PostMapping("/register")
    public UserDTO register(@RequestBody UserDTO userDTO){
        UserModel user = userService.createOrUpdate(userDTO);
        return userMapper.userEntityToUserDTO(user);
    }

    @PostMapping("/login")
    public UserDTO login(@RequestBody AuthDTO authDTO) {
        UserModel user = userService.getUserByUsernameAndPassword(authDTO.getUsername(), authDTO.getPassword());
        return userMapper.userEntityToUserDTO(user);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable("id") Integer id) {
        userService.deleteById(id);
    }
}
