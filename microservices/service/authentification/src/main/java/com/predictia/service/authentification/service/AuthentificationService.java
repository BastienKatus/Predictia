package com.predictia.service.authentification.service;

import com.predictia.dto.AuthDTO;
import com.predictia.dto.UserDTO;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AuthentificationService {

    public UserDTO login(AuthDTO authDTO) {
        String apiUrl = "http://localhost:8080/users/login";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<AuthDTO> request = new HttpEntity<>(authDTO, headers);

        // Envoi de la requête GET et récupération de la réponse
        ResponseEntity<UserDTO> response = restTemplate.exchange(apiUrl, HttpMethod.POST, request, UserDTO.class);
        return response.getBody();
    }

    public UserDTO register(UserDTO userDTO) {
        String apiUrl = "http://localhost:8080/users/register";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Assuming userLoginDTO is an instance of UserLoginDTO
        HttpEntity<UserDTO> request = new HttpEntity<>(userDTO, headers);

        ResponseEntity<UserDTO> response = restTemplate.exchange(apiUrl, HttpMethod.POST, request, UserDTO.class);
        return response.getBody();

    }
}
