package com.example.e_waste.DTO;

import com.example.e_waste.Entity.Feedback;

public class FeedbackDTO {
    private String comments;
    private int rating;

    // ✅ Default Constructor
    public FeedbackDTO() {}

    public FeedbackDTO(Feedback feedback) {
        this.comments = feedback.getComments();
        this.rating = feedback.getRating();
    }

    // ✅ Getters and Setters
    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}


