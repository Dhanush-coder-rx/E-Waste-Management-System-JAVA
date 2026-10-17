package com.example.e_waste.DTO;

public class BiddingRequest {
    private int bidItemId;
    private String email; // Email of the company
    private String bidPrice;

    // Getters and Setters
    public int getBidItemId() {
        return bidItemId;
    }

    public void setBidItemId(int bidItemId) {
        this.bidItemId = bidItemId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBidPrice() {
        return bidPrice;
    }

    public void setBidPrice(String bidPrice) {
        this.bidPrice = bidPrice;
    }
}