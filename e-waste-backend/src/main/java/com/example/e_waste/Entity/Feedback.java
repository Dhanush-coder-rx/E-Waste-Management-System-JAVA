package com.example.e_waste.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Feedback {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int id;

    private String comments;
    private int rating;
    private String date;

//    @ManyToOne
//    @JoinColumn(name = "assign_waste_id", nullable = false)
//    @JsonManagedReference // Avoids infinite recursion
//    private AssignWaste assignWaste;
    @ManyToOne
    @JoinColumn(name = "assign_waste_id", nullable = false)
    @JsonIgnoreProperties("feedbacks")  // Prevents recursion
    private AssignWaste assignWaste;



    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonManagedReference // Avoids infinite recursion
    private User user;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public AssignWaste getAssignWaste() {
        return assignWaste;
    }

    public void setAssignWaste(AssignWaste assignWaste) {
        this.assignWaste = assignWaste;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
