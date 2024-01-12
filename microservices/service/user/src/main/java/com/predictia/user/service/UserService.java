package com.predictia.user.service;

import com.predictia.dto.UserDTO;
import com.predictia.user.mapper.UserMapper;
import com.predictia.user.model.FollowedTeamsModel;
import com.predictia.user.model.UserModel;
import com.predictia.user.repository.FollowedTeamsRepository;
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
    private FollowedTeamsRepository followedTeamsRepository;
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
        List<FollowedTeamsModel> listFTId =  followedTeamsRepository.findAllByIdUser(id);
        return userModel.map(model -> userMapper.userEntityToUserDTO(model,listFTId)).orElse(null);
    }

    public UserDTO getUserByUsernameAndPassword(String u, String p )  {
        UserModel user = userRepository.findByUsernameAndPassword(u,p);
        List<FollowedTeamsModel> listFTId =  followedTeamsRepository.findAllByIdUser(user.getId());
        return userMapper.userEntityToUserDTO(user,listFTId);
    }

    @Transactional
    public UserDTO modifyUserFollowedTeams(Integer id, List<Integer> ftid){
        deleteFollowedTeamsByUserId(id);
        for(Integer idTeam: ftid){
            FollowedTeamsModel model = new FollowedTeamsModel();
            model.setIdUser(id);
            model.setIdTeam(idTeam);
            followedTeamsRepository.save(model);
        }
        return getUserById(id);
    }

    @Transactional
    public UserDTO createOrUpdate(UserDTO userDTO) {
        UserModel userModel = userMapper.userDTOToUserEntity(userDTO);
        userRepository.save(userModel);
        List<FollowedTeamsModel> listFTId =  followedTeamsRepository.findAllByIdUser(userDTO.getId());
        return userMapper.userEntityToUserDTO(userModel,listFTId);
    }

    public void deleteById(Integer id) {
        userRepository.deleteById(id);
    }


    public void deleteFollowedTeamsByUserId(Integer userId) {
        List<FollowedTeamsModel> allFollowedTeamsOfUser = followedTeamsRepository.findAllByIdUser(userId);
        allFollowedTeamsOfUser.forEach(followedTeamsModel -> followedTeamsRepository.deleteById(followedTeamsModel.getId()));
    }

    public void deleteAll(){
        userRepository.deleteAll();
    }
}
