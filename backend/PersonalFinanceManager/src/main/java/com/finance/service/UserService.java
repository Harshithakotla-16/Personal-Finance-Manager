package com.finance.service;

import java.util.List;

import com.finance.model.User;

public interface UserService {
    User registerUser(User user);
    User loginUser(String email, String password);
    List<User> getAllUsers();
    
    User getProfile(Long userId);

    User updateProfile(Long userId, User user);

    User changePassword(Long userId, String oldPassword, String newPassword);
}