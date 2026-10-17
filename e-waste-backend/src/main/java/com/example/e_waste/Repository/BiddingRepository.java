package com.example.e_waste.Repository;

import com.example.e_waste.Entity.Bidding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BiddingRepository extends JpaRepository<Bidding,Integer> {
    List<Bidding> findByBidItem_Id(int bidItemId);


}
