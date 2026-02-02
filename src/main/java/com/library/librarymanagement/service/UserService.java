package com.library.librarymanagement.service;

import com.library.librarymanagement.model.User;
import com.library.librarymanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get a single user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Add a new user
    public User addUser(User user) {
        return userRepository.save(user);
    }

    // Update user
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(updatedUser.getName());
                    user.setEmail(updatedUser.getEmail());
                    user.setPhone(updatedUser.getPhone());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    // Delete user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
