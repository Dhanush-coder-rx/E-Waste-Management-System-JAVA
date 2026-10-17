package com.example.e_waste.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class AssignWaste {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int id;



    private String assignDate;

    @ManyToOne
    @JoinColumn(name = "e_waste_request_id", nullable = false)
    @JsonManagedReference // Avoids infinite recursion
    private EWasteRequest eWasteRequest;

    @ManyToOne
    @JoinColumn(name = "delivery_boy_id", nullable = false)
    @JsonManagedReference // Avoids infinite recursion
    private DeliveryBoy deliveryBoy;

    private String price;



    @OneToMany(mappedBy = "assignWaste", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("assignWaste")  // Prevents recursion
    private List<Feedback> feedbacks;


    public List<Feedback> getFeedbacks() {
        return feedbacks;
    }

    public void setFeedbacks(List<Feedback> feedbacks) {
        this.feedbacks = feedbacks;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public long getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getAssignDate() {
        return assignDate;
    }

    public void setAssignDate(String assignDate) {
        this.assignDate = assignDate;
    }

    public EWasteRequest geteWasteRequest() {
        return eWasteRequest;
    }

    public void seteWasteRequest(EWasteRequest eWasteRequest) {
        this.eWasteRequest = eWasteRequest;
    }

    public DeliveryBoy getDeliveryBoy() {
        return deliveryBoy;
    }

    public void setDeliveryBoy(DeliveryBoy deliveryBoy) {
        this.deliveryBoy = deliveryBoy;
    }
}
