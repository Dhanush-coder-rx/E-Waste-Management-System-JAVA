package com.example.e_waste.Entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
public class EWasteRequest {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonManagedReference // Avoids infinite recursion
    private User user;

    @ManyToOne
    @JoinColumn(name = "e_waste_types_id", nullable = false)
    @JsonManagedReference // Avoids infinite recursion
    private EWasteTypes e_waste_types;

    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB") // or BLOB, , etc.
    private byte[] image;

    private String regDate;

    private String description;

    private  String pickupLocation;

    private String pickDate;

    private  String pickTime;

    private String status; // pending or approve

    private  double amount;

    private String payment;

    private String bid;




    @ManyToOne
    @JoinColumn(name = "sold_otherCompany_id", nullable = true)
    @JsonManagedReference // Avoids infinite recursion
    private OtherCompany otherCompany;

    public String getBid() {
        return bid;
    }

    public void setBid(String bid) {
        this.bid = bid;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getPayment() {
        return payment;
    }

    public void setPayment(String payment) {
        this.payment = payment;
    }

    public String getPickDate() {
        return pickDate;
    }

    public void setPickDate(String pickDate) {
        this.pickDate = pickDate;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public EWasteTypes getE_waste_types() {
        return e_waste_types;
    }

    public void setE_waste_types(EWasteTypes e_waste_types) {
        this.e_waste_types = e_waste_types;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getRegDate() {
        return regDate;
    }

    public void setRegDate(String regDate) {
        this.regDate = regDate;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getPickTime() {
        return pickTime;
    }

    public void setPickTime(String pickTime) {
        this.pickTime = pickTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OtherCompany getOtherCompany() {
        return otherCompany;
    }

    public void setOtherCompany(OtherCompany otherCompany) {
        this.otherCompany = otherCompany;
    }
}
