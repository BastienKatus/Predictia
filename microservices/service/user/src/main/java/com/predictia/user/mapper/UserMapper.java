package com.predictia.user.mapper;

import com.predictia.dto.UserDTO;
import com.predictia.user.model.UserModel;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class UserMapper {

    public UserModel userDTOToUserEntity(UserDTO dto){
        UserModel u = new UserModel();
        u.setId(dto.getId());
        u.setUsername(dto.getUsername());
        u.setPassword(dto.getPassword());
        u.setFirstname(dto.getFirstname());
        u.setLastname(dto.getLastname());
        u.setMail(dto.getMail());
        u.setFavoriteClubId(dto.getFavoriteClubId());
        if(dto.getCredits() != null){
            u.setCredits(Double.valueOf(dto.getCredits().toString()));
        }
        return u;
    }

    public UserDTO userEntityToUserDTO(UserModel userModel){
        UserDTO u = new UserDTO();
        u.setId(userModel.getId());
        u.setUsername(userModel.getUsername());
        u.setPassword(userModel.getPassword());
        u.setFirstname(userModel.getFirstname());
        u.setLastname(userModel.getLastname());
        u.setMail(userModel.getMail());
        u.setFavoriteClubId(userModel.getFavoriteClubId());
        if(userModel.getCredits()!=null){
            u.setCredits(BigDecimal.valueOf(userModel.getCredits()));
        }
        return u;
    }
}
