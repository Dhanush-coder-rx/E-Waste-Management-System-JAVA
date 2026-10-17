package com.example.e_waste.Controller;

import com.example.e_waste.DTO.PasswordUpdateRequest;

import com.example.e_waste.Entity.DeliveryBoy;
import com.example.e_waste.Repository.DeliveryBoyRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class DeliveryBoyController {


    @Autowired
    private DeliveryBoyRepository deliveryBoyRepository;


    @PostMapping("/registerDeliveryBoy")
    public ResponseEntity<?> registerDel(@RequestBody DeliveryBoy deliveryBoy) {
        // Check if the email already exists
        if (deliveryBoyRepository.findByEmail(deliveryBoy.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email already exists", HttpStatus.BAD_REQUEST);
        }

        // Save the new user
        deliveryBoyRepository.save(deliveryBoy);
        return new ResponseEntity<>("Register Successfully", HttpStatus.CREATED);
    }

    @GetMapping("/deliveryBoys")
    public ResponseEntity<List<DeliveryBoy>> getAllDeliveryBoys() {
        List<DeliveryBoy> deliveryBoys = deliveryBoyRepository.findAll();
        return new ResponseEntity<>(deliveryBoys, HttpStatus.OK);
    }





    @PutMapping("/updateDeliveryBoy/{id}")
    public ResponseEntity<?> updateDeliveryBoy(@PathVariable Long id, @RequestBody DeliveryBoy updatedBoy) {
        return deliveryBoyRepository.findById(Math.toIntExact(id)).map(existingBoy -> {
            existingBoy.setName(updatedBoy.getName());
            existingBoy.setEmail(updatedBoy.getEmail()); // Optional: you may choose to not update email
            existingBoy.setMobile(updatedBoy.getMobile());
            existingBoy.setPassword(updatedBoy.getPassword());

            deliveryBoyRepository.save(existingBoy);
            return new ResponseEntity<>("Updated successfully", HttpStatus.OK);
        }).orElseGet(() -> new ResponseEntity<>("Delivery boy not found", HttpStatus.NOT_FOUND));
    }






























    @PutMapping("/updatePasswordForDeliveryBoy")
    public ResponseEntity<String> updatePasswordForDel(@RequestBody PasswordUpdateRequest request) {
        // Validate input
        if (request.getNewPassword() == null || request.getOldPassword() == null || request.getConfirmPassword() == null) {
            return ResponseEntity.badRequest().body("Old password, new password, and confirm password are required.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("New password and confirm password do not match.");
        }

        // Find Admin user by email
        Optional<DeliveryBoy> optionalAdmin = deliveryBoyRepository.findByEmail(request.getEmail());
        if (optionalAdmin.isEmpty()) {
            return ResponseEntity.status(404).body("Admin user not found.");
        }

        DeliveryBoy user = optionalAdmin.get();

        // Validate old password
        if (!user.getPassword().equals(request.getOldPassword())) {
            return ResponseEntity.badRequest().body("Invalid current password.");
        }

        // Update password
        user.setPassword(request.getNewPassword());
        deliveryBoyRepository.save(user);

        return ResponseEntity.ok("Password updated successfully.");
    }
}
