package com.predictia.user.controller;

import com.predictia.dto.AuthDTO;
import com.predictia.dto.UserDTO;
import com.predictia.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "", allowedHeaders = "")
@RequestMapping("/")
public class UserController {

    @Autowired
    private UserService userService;

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
        return userService.createOrUpdate(userDTO);
    }

    @PostMapping("/followedteams/{id}")
    public UserDTO modifyFollowedTeams(@PathVariable("id") Integer id,@RequestBody List<Integer> idteams){
       return userService.modifyUserFollowedTeams(id,idteams);
    }

    @PostMapping("/login")
    public UserDTO login(@RequestBody AuthDTO authDTO) {
       return userService.getUserByUsernameAndPassword(authDTO.getUsername(), authDTO.getPassword());
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable("id") Integer id) {
        userService.deleteById(id);
    }
}
