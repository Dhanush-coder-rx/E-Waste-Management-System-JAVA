package com.example.e_waste.Controller;

import com.example.e_waste.DTO.PasswordUpdateRequest;
import com.example.e_waste.Entity.User;
import com.example.e_waste.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;


    @PostMapping("/registerUser")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Check if the email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email already exists", HttpStatus.BAD_REQUEST);
        }

        // Save the new user
        userRepository.save(user);
        return new ResponseEntity<>("Register Successfully", HttpStatus.CREATED);
    }



    @PutMapping("/updatePasswordForUser")
    public ResponseEntity<String> updatePasswordForLen(@RequestBody PasswordUpdateRequest request) {
        // Validate input
        if (request.getNewPassword() == null || request.getOldPassword() == null || request.getConfirmPassword() == null) {
            return ResponseEntity.badRequest().body("Old password, new password, and confirm password are required.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("New password and confirm password do not match.");
        }

        // Find  user by email
        Optional<User> optionalAdmin = userRepository.findByEmail(request.getEmail());
        if (optionalAdmin.isEmpty()) {
            return ResponseEntity.status(404).body(" User not found.");
        }

        User user = optionalAdmin.get();

        // Validate old password
        if (!user.getPassword().equals(request.getOldPassword())) {
            return ResponseEntity.badRequest().body("Invalid current password.");
        }

        // Update password
        user.setPassword(request.getNewPassword());
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully.");
    }
}
