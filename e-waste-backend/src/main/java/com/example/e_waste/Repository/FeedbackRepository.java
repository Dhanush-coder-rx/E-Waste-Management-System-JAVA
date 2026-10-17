package com.example.e_waste.Repository;

import com.example.e_waste.Entity.AssignWaste;
import com.example.e_waste.Entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback ,Integer> {

    List<Feedback> findByAssignWaste(AssignWaste assignWaste);
}
