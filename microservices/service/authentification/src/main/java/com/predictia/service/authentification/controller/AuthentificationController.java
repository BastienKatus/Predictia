package com.predictia.service.authentification.controller;

import com.predictia.dto.AuthDTO;
import com.predictia.dto.UserDTO;
import com.predictia.service.authentification.service.AuthentificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "", allowedHeaders = "")
@RequestMapping("/")
public class AuthentificationController {

    @Autowired
    AuthentificationService authentificationService;

    @PostMapping("/login")
    public UserDTO login(@RequestBody AuthDTO authDTO) {
        return authentificationService.login(authDTO);
    }

    @PostMapping("/register")
    public UserDTO register(@RequestBody UserDTO userDTO) {
        return authentificationService.register(userDTO);
    }
}
