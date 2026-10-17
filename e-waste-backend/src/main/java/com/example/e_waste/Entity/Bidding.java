package com.example.e_waste.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
public class Bidding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "bid_item_id", nullable = false)
    @JsonManagedReference // Avoids infinite recursion
    private BidItem bidItem;

    @ManyToOne
    @JoinColumn(name = "other_company_id", nullable = false)
    @JsonManagedReference // Avoids infinite recursion
    private OtherCompany otherCompany;

    private String bidPrice;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public BidItem getBidItem() {
        return bidItem;
    }

    public void setBidItem(BidItem bidItem) {
        this.bidItem = bidItem;
    }

    public OtherCompany getOtherCompany() {
        return otherCompany;
    }

    public void setOtherCompany(OtherCompany otherCompany) {
        this.otherCompany = otherCompany;
    }

    public String getBidPrice() {
        return bidPrice;
    }

    public void setBidPrice(String bidPrice) {
        this.bidPrice = bidPrice;
    }
}