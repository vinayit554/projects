package com.bej.authentication.controller;

import com.bej.authentication.exception.UserAlreadyExistsException;
import com.bej.authentication.exception.InvalidCredentialsException;
import com.bej.authentication.exception.UserNotFoundException;
import com.bej.authentication.security.SecurityTokenGenerator;
import com.bej.authentication.service.IUserService;
import com.bej.authentication.domain.User;
import com.bej.authentication.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v0")
public class UserController {
    //Autowire the dependencies for UserService and SecurityTokenGenerator

    private UserServiceImpl userService;
    private SecurityTokenGenerator securityTokenGenerator;
    private ResponseEntity responseEntity;
   @Autowired
   public UserController(UserServiceImpl userService, SecurityTokenGenerator securityTokenGenerator) {
        this.userService = userService;
        this.securityTokenGenerator = securityTokenGenerator;
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveUser(@RequestBody User user) {
        // Write the logic to save a user,
        // return 201 status if user is saved else 500 status
        try{
            responseEntity=new ResponseEntity<>(userService.saveUser(user),HttpStatus.CREATED);

        } catch (UserAlreadyExistsException e) {
            responseEntity=new ResponseEntity<>(e,HttpStatus.CONFLICT);
        }

        return responseEntity;
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) throws InvalidCredentialsException {
        // Generate the token on login,
        // return 200 status if user is saved else 500 status
        User loggedInUser = null;
        try{
            loggedInUser = userService.getUserByEmailIdAndPassword(user.getEmailId(), user.getPassword());
        }
        catch (InvalidCredentialsException e){
//            throw new InvalidCredentialsException();
            responseEntity = new ResponseEntity<>("Invalid credentials", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if(loggedInUser!=null){
            String token = securityTokenGenerator.createToken(user);
            responseEntity = new ResponseEntity<>(token, HttpStatus.OK);
        }

        return responseEntity;
    }

    @PutMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(@RequestBody User user) throws UserNotFoundException{
       try {
           User updatedUser = userService.updateUserPassword(user);
           return responseEntity = new ResponseEntity<>(updatedUser, HttpStatus.OK);
       }
       catch (UserNotFoundException e){
          return responseEntity = new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
       }
    }
}
