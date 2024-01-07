package com.predictia.user.controller;

import com.predictia.dto.AuthDTO;
import com.predictia.dto.UserDTO;
import com.predictia.user.model.User;
import com.predictia.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "", allowedHeaders = "")
@RequestMapping("/")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping()
    public Iterable<User> getAllUser(){
        return userService.getAllUser();
    }

    @GetMapping("/{id}")
    public Optional<User> findById(@PathVariable("id") Integer id){
        return userService.getUserById(id);
    }

    @PostMapping("/register")
    public String postUser(@RequestBody UserDTO userDTO){
        userService.addUser(userDTO);
        return "Création de l'utilisateur en cours";
    }

    @PostMapping("/login")
    public User login(@RequestBody AuthDTO authDTO) {
        return userService.getUserByUsernameAndPassword(authDTO.getUsername(), authDTO.getPassword());
    }


}
