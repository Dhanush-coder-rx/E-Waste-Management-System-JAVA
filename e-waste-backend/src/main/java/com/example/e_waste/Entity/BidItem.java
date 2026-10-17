package com.example.e_waste.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
public class BidItem {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "e_waste_types_id", nullable = false)
    @JsonManagedReference // Avoids infinite recursion
    private EWasteTypes eWasteTypes;

    private String basePrice;
    private String description;
    private String status;

    private String lastdte;

    private String stockCount;// all un-sold e-waste request , means those records didn't have sold_otherCompany_id.

    public String getLastdte() {
        return lastdte;
    }

    public void setLastdte(String lastdte) {
        this.lastdte = lastdte;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public EWasteTypes geteWasteTypes() {
        return eWasteTypes;
    }

    public void seteWasteTypes(EWasteTypes eWasteTypes) {
        this.eWasteTypes = eWasteTypes;
    }

    public String getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(String basePrice) {
        this.basePrice = basePrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStockCount() {
        return stockCount;
    }

    public void setStockCount(String stockCount) {
        this.stockCount = stockCount;
    }
}
