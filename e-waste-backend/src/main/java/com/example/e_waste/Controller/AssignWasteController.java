package com.example.e_waste.Controller;

import com.example.e_waste.DTO.AssignWasteDTO;
import com.example.e_waste.Entity.*;
import com.example.e_waste.Repository.*;
import com.example.e_waste.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
public class AssignWasteController {


    @Autowired
    private AssignWasteRepository assignWasteRepository;

    @Autowired
    private EwasteRequestRepository ewasteRequestRepository;

    @Autowired
    private DeliveryBoyRepository deliveryBoyRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;


    @PostMapping("/assignWaste")
    public ResponseEntity<?> assignWaste(
            @RequestParam("requestId") int requestId,
            @RequestParam("deliveryBoyId") int deliveryBoyId,
            @RequestParam("assignDate") String assignDate) {

        try {
            // Fetch the E-Waste request
            EWasteRequest ewasteRequest = ewasteRequestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("E-Waste Request not found"));

            // Fetch the Delivery Boy
            DeliveryBoy deliveryBoy = deliveryBoyRepository.findById(deliveryBoyId)
                    .orElseThrow(() -> new RuntimeException("Delivery Boy not found"));

            // Create AssignWaste object
            AssignWaste assignWaste = new AssignWaste();
            assignWaste.seteWasteRequest(ewasteRequest);
            assignWaste.setDeliveryBoy(deliveryBoy);
            assignWaste.setAssignDate(assignDate);

            // Save to AssignWaste repository
            assignWasteRepository.save(assignWaste);


            ewasteRequest.setStatus("Assigned");
            ewasteRequestRepository.save(ewasteRequest);

            return ResponseEntity.ok("Delivery boy assigned successfully!");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }



    @GetMapping("/assignedWaste/{email}")
    public ResponseEntity<?> getAssignedWasteByDeliveryBoyEmail(@PathVariable String email) {
        try {
            // Fetch Delivery Boy using email
            DeliveryBoy deliveryBoy = deliveryBoyRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Delivery Boy not found"));

            // Fetch assigned waste details for the delivery boy
            List<AssignWaste> assignedWasteList = assignWasteRepository.findByDeliveryBoy(deliveryBoy);

            return ResponseEntity.ok(assignedWasteList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }



//    @PutMapping("/assignedWaste/{id}/pay")
//    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id) {
//        try {
//            // Fetch assigned waste entry by ID
//            Optional<AssignWaste> optionalAssignWaste = assignWasteRepository.findById(Math.toIntExact(id));
//
//            if (!optionalAssignWaste.isPresent()) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                        .body("Error: Assigned Waste not found.");
//            }
//
//            AssignWaste assignWaste = optionalAssignWaste.get();
//
//            // Set payment status to "Paid"
//            assignWaste.getE_waste_request_id().setPayment("Paid");
//            assignWaste.setPrice(amount);
//            assignWasteRepository.save(assignWaste);
//
//            // Extract user details
//            String userEmail = assignWaste.getE_waste_request_id().getUser().getEmail();
//            double amount = assignWaste.getE_waste_request_id().getAmount();
//
//            // Send email notification
//            String subject = "E-Waste Management - Payment Successful";
//            String message = "Your payment of ₹" + amount + " has been successfully paid. Thank you for using our service!";
//            emailService.sendEmail(userEmail, subject, message);
//
//            return ResponseEntity.ok("Payment updated successfully and email sent.");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error: " + e.getMessage());
//        }
//    }


    @PutMapping("/assignedWaste/{id}/pay")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id) {
        try {
            // Fetch assigned waste entry by ID
            Optional<AssignWaste> optionalAssignWaste = assignWasteRepository.findById(Math.toIntExact(id));

            if (!optionalAssignWaste.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Error: Assigned Waste not found.");
            }

            AssignWaste assignWaste = optionalAssignWaste.get();

            // Get the amount from the related e-waste request
            double amount = assignWaste.geteWasteRequest().getAmount();

            // Set payment status and price
            assignWaste.geteWasteRequest().setPayment("Paid");
            assignWaste.setPrice(String.valueOf(amount)); // Ensure the amount is properly set
            assignWasteRepository.save(assignWaste);

            // Extract user details
            String userEmail = assignWaste.geteWasteRequest().getUser().getEmail();

            // Send email notification
            String subject = "E-Waste Management - Payment Successful";
            String message = "Your payment of ₹" + amount + " has been successfully paid. Thank you for using our service!";
            emailService.sendEmail(userEmail, subject, message);

            return ResponseEntity.ok("Payment updated successfully and email sent.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }


    @GetMapping("/paidRequests")
    public ResponseEntity<?> getPaidRequests() {
        try {
            List<AssignWaste> paidAssignments = assignWasteRepository.findByPriceNotNullAndEWasteRequest_OtherCompanyIsNull();
            List<AssignWasteDTO> response = paidAssignments.stream()
                    .map(AssignWasteDTO::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }




    @GetMapping("/paidRequests/{email}")
    public ResponseEntity<?> getPaidRequestsByEmail(@PathVariable String email) {
        try {
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found with email: " + email);
            }

            List<AssignWaste> paidRequests = assignWasteRepository.findByEWasteRequest_UserAndPriceIsNotNull(user.get());
            return ResponseEntity.ok(paidRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

}
