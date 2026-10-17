package com.example.e_waste.Controller;


import com.example.e_waste.DTO.PasswordUpdateRequest;
import com.example.e_waste.Entity.OtherCompany;
import com.example.e_waste.Repository.OtherCompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin("*")
public class OtherCompanyController {

    @Autowired
    private OtherCompanyRepository otherCompanyRepository;


    @PostMapping("/registerOtherCompany")
    public ResponseEntity<?> registerOtherCompany(@RequestBody OtherCompany otherCompany) {
        // Check if the email already exists
        if (otherCompanyRepository.findByEmail(otherCompany.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email already exists", HttpStatus.BAD_REQUEST);
        }

        // Save the new user
        otherCompanyRepository.save(otherCompany);
        return new ResponseEntity<>("Register Successfully", HttpStatus.CREATED);
    }

    @GetMapping("/getAllOtherCompany")
    public ResponseEntity<?> getOtherCompany(){
        return ResponseEntity.ok(otherCompanyRepository.findAll());
    }



    @PutMapping("/updatePasswordForOtherCompany")
    public ResponseEntity<String> updatePasswordForOther(@RequestBody PasswordUpdateRequest request) {
        // Validate input
        if (request.getNewPassword() == null || request.getOldPassword() == null || request.getConfirmPassword() == null) {
            return ResponseEntity.badRequest().body("Old password, new password, and confirm password are required.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("New password and confirm password do not match.");
        }

        // Find Admin user by email
        Optional<OtherCompany> optionalAdmin = otherCompanyRepository.findByEmail(request.getEmail());
        if (optionalAdmin.isEmpty()) {
            return ResponseEntity.status(404).body("OtherCompany user not found.");
        }

        OtherCompany otherCompany = optionalAdmin.get();

        // Validate old password
        if (!otherCompany.getPassword().equals(request.getOldPassword())) {
            return ResponseEntity.badRequest().body("Invalid current password.");
        }

        // Update password
        otherCompany.setPassword(request.getNewPassword());
        otherCompanyRepository.save(otherCompany);

        return ResponseEntity.ok("Password updated successfully.");
    }
}
