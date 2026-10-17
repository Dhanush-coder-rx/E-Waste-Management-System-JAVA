package com.example.e_waste.Controller;


import com.example.e_waste.Entity.BidItem;
import com.example.e_waste.Repository.BidItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")
public class BidItemController {

    @Autowired
    private BidItemRepository bidItemRepository;

    @GetMapping("/bids")
    public ResponseEntity<List<BidItem>> getAllBids() {
        List<BidItem> bids = bidItemRepository.findAll();
        return ResponseEntity.ok(bids);
    }

}
