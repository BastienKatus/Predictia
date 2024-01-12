package com.predictia.user.controller;

import com.predictia.dto.AuthDTO;
import com.predictia.dto.UserDTO;
import com.predictia.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
    public UserDTO modifyFollowedTeams(@PathVariable("id") Integer id, @RequestBody String jsonString){
        List<Integer> followedTeamIds = new ArrayList<Integer>();
        try {
            JSONObject jsonObject = new JSONObject(jsonString);
            JSONArray jsonArray = jsonObject.getJSONArray("followedTeamIds");
            for(int i = 0; i < jsonArray.length(); i++){
                followedTeamIds.add(Integer.parseInt(jsonArray.get(i).toString()));
            }
        } catch (JSONException e) {
            System.out.println("JSONException, the json format is invalid");
        }
        return userService.modifyUserFollowedTeams(id,followedTeamIds);
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
