package com.example.e_waste.Controller;


import com.example.e_waste.Entity.AssignWaste;
import com.example.e_waste.Entity.Feedback;
import com.example.e_waste.Entity.User;
import com.example.e_waste.Repository.AssignWasteRepository;
import com.example.e_waste.Repository.FeedbackRepository;
import com.example.e_waste.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private AssignWasteRepository assignWasteRepository;

    @Autowired
    private UserRepository userRepository;


    @PostMapping("/add-feedback")
    public ResponseEntity<?> addFeedback(@RequestBody Map<String, Object> feedbackData) {
        try {
            System.out.println("Received feedback: " + feedbackData);

            // Extract values manually
            String comments = (String) feedbackData.get("comments");
            int rating = (int) feedbackData.get("rating");
            String date = (String) feedbackData.get("date");

            Map<String, Object> assignWasteMap = (Map<String, Object>) feedbackData.get("assignWaste");
            Long assignWasteId = Long.valueOf(assignWasteMap.get("id").toString());

            Map<String, Object> userMap = (Map<String, Object>) feedbackData.get("user");
            String userEmail = (String) userMap.get("email");

            // Validate assignWaste
            Optional<AssignWaste> assignWaste = assignWasteRepository.findById(Math.toIntExact(assignWasteId));
            if (assignWaste.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid AssignWaste ID.");
            }

            // Validate user by email
            Optional<User> user = userRepository.findByEmail(userEmail);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found with given email.");
            }

            // Create Feedback object
            Feedback feedback = new Feedback();
            feedback.setComments(comments);
            feedback.setRating(rating);
            feedback.setDate(date);
            feedback.setAssignWaste(assignWaste.get());
            feedback.setUser(user.get());

            // Save feedback
            Feedback savedFeedback = feedbackRepository.save(feedback);

            return ResponseEntity.ok(savedFeedback);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }



}