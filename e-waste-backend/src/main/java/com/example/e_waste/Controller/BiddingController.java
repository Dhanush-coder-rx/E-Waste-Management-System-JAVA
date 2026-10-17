package com.example.e_waste.Controller;

import com.example.e_waste.DTO.BiddingRequest;
import com.example.e_waste.Entity.BidItem;
import com.example.e_waste.Entity.Bidding;
import com.example.e_waste.Entity.OtherCompany;
import com.example.e_waste.Repository.BidItemRepository;
import com.example.e_waste.Repository.BiddingRepository;
import com.example.e_waste.Repository.OtherCompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class BiddingController {

    @Autowired
    private BidItemRepository bidItemRepository;

    @Autowired
    private BiddingRepository biddingRepository;

    @Autowired
    private OtherCompanyRepository otherCompanyRepository;

    // POST: Place a new bid using email
    @PostMapping("/place")
    public ResponseEntity<?> placeBid(@RequestBody BiddingRequest biddingRequest) {
        try {
            // Fetch the bid item
            Optional<BidItem> bidItemOptional = bidItemRepository.findById(biddingRequest.getBidItemId());
            if (!bidItemOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bid Item not found.");
            }

            // Fetch the company by email
            Optional<OtherCompany> companyOptional = otherCompanyRepository.findByEmail(biddingRequest.getEmail());
            if (!companyOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Company with provided email not found.");
            }

            // Create and save bidding entry
            Bidding bidding = new Bidding();
            bidding.setBidItem(bidItemOptional.get());
            bidding.setOtherCompany(companyOptional.get());
            bidding.setBidPrice(biddingRequest.getBidPrice());

            biddingRepository.save(bidding);

            return ResponseEntity.ok("Bid placed successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error placing bid: " + e.getMessage());
        }
    }

    // GET: Fetch all bids
    @GetMapping("/all")
    public ResponseEntity<List<Bidding>> getAllBids() {
        return ResponseEntity.ok(biddingRepository.findAll());
    }

    // GET: Fetch bids by Bid Item ID
    @GetMapping("/by-bid-item/{bidItemId}")
    public ResponseEntity<?> getBidsByBidItem(@PathVariable int bidItemId) {
        List<Bidding> bids = biddingRepository.findByBidItem_Id(bidItemId);
        if (bids.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No bids found for this Bid Item.");
        }
        return ResponseEntity.ok(bids);
    }
}