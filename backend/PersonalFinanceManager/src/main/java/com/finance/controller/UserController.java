package com.finance.controller;

import com.finance.dto.PasswordRequest;
import com.finance.model.Income;
import com.finance.model.User;
import com.finance.service.UserService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/get")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User newUser = userService.registerUser(user);
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        try {
            User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/profile")
    public User getProfile(@RequestParam Long userId) {
        return userService.getProfile(userId);
    }
    
    @PutMapping("/profile")
    public User updateProfile(@RequestParam Long userId,
                              @RequestBody User user) {
        return userService.updateProfile(userId, user);
    }
    
    @PutMapping("/change-password")
    public User changePassword(@RequestParam Long userId,
                               @RequestBody PasswordRequest request) {

        return userService.changePassword(
                userId,
                request.getOldPassword(),
                request.getNewPassword()
        );
    }
    
}