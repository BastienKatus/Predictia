package com.predictia.user.mapper;

import com.predictia.dto.UserDTO;
import com.predictia.user.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {

    public User dtoToEntity(UserDTO dto){
        User u = new User();
        u.setId(dto.getId());
        u.setUsername(dto.getUsername());
        u.setPassword(dto.getPassword());
        u.setFirstname(dto.getFirstname());
        u.setLastname(dto.getLastname());
        u.setBirthdate(dto.getBirthdate());
        u.setMail(dto.getMail());
        u.setFavoriteClubId(dto.getFavoriteClubID());
        u.setCredits(Double.valueOf(dto.getCredits().toString()));
        return u;
    }
}
