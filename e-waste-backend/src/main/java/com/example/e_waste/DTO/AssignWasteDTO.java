package com.example.e_waste.DTO;

import com.example.e_waste.Entity.AssignWaste;

import java.util.List;
import java.util.stream.Collectors;

public class AssignWasteDTO {
    private Long id;
    private Double price;
    private List<FeedbackDTO> feedbacks;
    private Long ewasteRequestId;
    private String ewasteTypeName;

    //  Default Constructor
    public AssignWasteDTO() {}

    //  Constructor with Entity Mapping
    public AssignWasteDTO(AssignWaste assignWaste) {
        this.id = assignWaste.getId();
        this.price = Double.valueOf(assignWaste.getPrice());
        this.feedbacks = assignWaste.getFeedbacks().stream()
                .map(FeedbackDTO::new)
                .collect(Collectors.toList());

        //  Include ewasteRequest and ewasteType name
        if (assignWaste.geteWasteRequest() != null) {
            this.ewasteRequestId = (long) assignWaste.geteWasteRequest().getId();
            if (assignWaste.geteWasteRequest().getE_waste_types() != null) {
                this.ewasteTypeName = assignWaste.geteWasteRequest().getE_waste_types().getName();
            }
        }
    }

    //  Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public List<FeedbackDTO> getFeedbacks() { return feedbacks; }
    public void setFeedbacks(List<FeedbackDTO> feedbacks) { this.feedbacks = feedbacks; }

    public Long getEwasteRequestId() { return ewasteRequestId; }
    public void setEwasteRequestId(Long ewasteRequestId) { this.ewasteRequestId = ewasteRequestId; }

    public String getEwasteTypeName() { return ewasteTypeName; }
    public void setEwasteTypeName(String ewasteTypeName) { this.ewasteTypeName = ewasteTypeName; }
}
