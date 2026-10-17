package com.example.e_waste.Repository;

import com.example.e_waste.Entity.EWasteRequest;
import com.example.e_waste.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EwasteRequestRepository extends JpaRepository<EWasteRequest , Integer> {

    List<EWasteRequest> findByUser(User user);

    List<EWasteRequest> findByStatus(String status);

    List<EWasteRequest> findByUserAndStatusAndAmountGreaterThan(User user, String status, double amount);


    List<EWasteRequest> findByBid(String bid);

    List<EWasteRequest> findByStatusAndAmountGreaterThanAndStatusNot(String status, int amount, String excludedStatus);


}
