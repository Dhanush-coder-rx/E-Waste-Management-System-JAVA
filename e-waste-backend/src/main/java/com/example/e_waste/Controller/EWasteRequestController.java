package com.example.e_waste.Controller;

import com.example.e_waste.Entity.*;
import com.example.e_waste.Repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class EWasteRequestController {

    @Autowired
    private EwasteRequestRepository ewasteRequestRepository;

    @Autowired
    private EWasteTypesRepository eWasteTypesRepository;

    @Autowired
    private BidItemRepository bidItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtherCompanyRepository otherCompanyRepository;

    @Autowired
    private JavaMailSender javaMailSender;

    @PostMapping("/e-waste-request")
    public ResponseEntity<?> createEWasteRequest(@RequestParam String email,
                                                 @RequestParam Long eWasteTypeId,
                                                 @RequestParam(required = false) MultipartFile image,
                                                 @RequestParam String description,
                                                 @RequestParam String regDate,
                                                 @RequestParam String pickupLocation,
                                                 @RequestParam String pickDate,
                                                 @RequestParam String pickTime) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            EWasteTypes eWasteType = eWasteTypesRepository.findById(Math.toIntExact(eWasteTypeId))
                    .orElseThrow(() -> new RuntimeException("E-Waste Type not found"));

            EWasteRequest ewasteRequest = new EWasteRequest();
            ewasteRequest.setUser(user);
            ewasteRequest.setE_waste_types(eWasteType);
            ewasteRequest.setDescription(description);
            ewasteRequest.setRegDate(regDate);
            ewasteRequest.setPickupLocation(pickupLocation);
            ewasteRequest.setPickDate(pickDate);
            ewasteRequest.setPickTime(pickTime);
            ewasteRequest.setStatus("Processing");

            if (image != null && !image.isEmpty()) {
                ewasteRequest.setImage(image.getBytes());
            }

            EWasteRequest savedRequest = ewasteRequestRepository.save(ewasteRequest);
            return ResponseEntity.ok(savedRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }


    @GetMapping("/e-waste-request/{email}")
    public ResponseEntity<?> getAllEWasteRequestsByUser(@PathVariable String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<EWasteRequest> requests = ewasteRequestRepository.findByUser(user);

            if (requests.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No e-waste requests found for this user.");
            }

            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/e-waste-request/processing")
    public ResponseEntity<?> getAllProcessingEWasteRequests() {
        try {
            List<EWasteRequest> requests = ewasteRequestRepository.findByStatus("Processing");

            if (requests.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No processing e-waste requests found.");
            }

            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/e-waste-request/{email}/approved")
    public ResponseEntity<?> getAllApprovedEWasteRequestsByUser(@PathVariable String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<EWasteRequest> approvedRequests = ewasteRequestRepository.findByUserAndStatusAndAmountGreaterThan(user, "Approved", 0);

            if (approvedRequests.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No approved e-waste requests with a valid amount found for this user.");
            }

            return ResponseEntity.ok(approvedRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/e-waste-request/approvedd")
    public ResponseEntity<?> getAllApprovedEWasteRequests() {
        try {
            // Fetch all requests that are "Approved" but not "Assigned"
            List<EWasteRequest> approvedRequests = ewasteRequestRepository.findByStatusAndAmountGreaterThanAndStatusNot(
                    "Approved", 0, "Assigned");

            if (approvedRequests.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No approved e-waste requests with a valid amount found.");
            }

            return ResponseEntity.ok(approvedRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }



    @PutMapping("/e-waste-request/{id}/approve")
    public ResponseEntity<?> updateEWasteRequest(
            @PathVariable Long id,
            @RequestParam("amount") double amount) {
        try {
            EWasteRequest request = ewasteRequestRepository.findById(Math.toIntExact(id))
                    .orElseThrow(() -> new RuntimeException("E-Waste request not found"));

            // Update amount
            request.setAmount(amount);

            // Update status to Approved
            request.setStatus("Approved");

            // Save updated request
            ewasteRequestRepository.save(request);

            return ResponseEntity.ok("E-Waste request updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }



    @PostMapping("/e-waste-request/bid-open")
    public ResponseEntity<?> openBidForRequests(@RequestBody Map<String, Object> requestBody) {
        try {
            // Extract values from request
            List<Integer> requestIds = (List<Integer>) requestBody.get("requestIds");
            String basePrice = (String) requestBody.get("basePrice");
            String description = (String) requestBody.get("description");
            String status = (String) requestBody.get("status");
            String lastdate = (String) requestBody.get("lastdate");

            // Fetch all EWasteRequests matching request IDs
            List<EWasteRequest> ewasteRequests = ewasteRequestRepository.findAllById(requestIds);

            if (ewasteRequests.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No E-Waste Requests found for given IDs.");
            }

            // Update bid status for all requests
            ewasteRequests.forEach(request -> request.setBid("Bid Open"));
            ewasteRequestRepository.saveAll(ewasteRequests);

            // Get unique e-waste type from the first request (assuming all are of same type)
            EWasteTypes eWasteType = ewasteRequests.get(0).getE_waste_types();

            // Create only one BidItem for this e-waste type
            BidItem bidItem = new BidItem();
            bidItem.seteWasteTypes(eWasteType);
            bidItem.setBasePrice(basePrice);
            bidItem.setDescription(description);
            bidItem.setStatus(status);
            bidItem.setLastdte(lastdate);
            bidItem.setStockCount(String.valueOf(requestIds.size())); // Set stock count as the number of request IDs

            // Save the single BidItem entry
            bidItemRepository.save(bidItem);

            // Send Email to All Other Companies
            sendBidOpenEmailToCompanies();

            return ResponseEntity.ok("Bid status updated, BidItem created, and email notifications sent successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating bid status, creating bid item, and sending email: " + e.getMessage());
        }
    }

    private void sendBidOpenEmailToCompanies() {
        List<OtherCompany> companies = otherCompanyRepository.findAll();
        for (OtherCompany company : companies) {
            sendEmail(company.getEmail(), "New E-Waste Bid Open",
                    "Dear " + company.getName() + ",\n\nA new bid has been opened for e-waste. Please check the portal for details.\n\nRegards,\nE-Waste Management Team");
        }
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        javaMailSender.send(message);
    }





    @GetMapping("/e-waste-request/bid-open")
    public ResponseEntity<?> getAllBidOpenRequests() {
        try {
            List<EWasteRequest> bidOpenRequests = ewasteRequestRepository.findByBid("Bid Open");

            if (bidOpenRequests.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No E-Waste Requests found with Bid Open.");
            }

            return ResponseEntity.ok(bidOpenRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching bid open requests: " + e.getMessage());
        }
    }


//    // POST method to assign OtherCompany to multiple EWasteRequests
//    @PostMapping("/assign-other-company")
//    public ResponseEntity<String> assignOtherCompany(@RequestParam int otherCompanyId, @RequestBody List<Integer> ewasteRequestIds) {
//        // Find OtherCompany by ID
//        Optional<OtherCompany> otherCompanyOptional = otherCompanyRepository.findById(otherCompanyId);
//        if (!otherCompanyOptional.isPresent()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("OtherCompany not found");
//        }
//        OtherCompany otherCompany = otherCompanyOptional.get();
//
//        // Find all EWasteRequests by their IDs
//        List<EWasteRequest> ewasteRequests = ewasteRequestRepository.findAllById(ewasteRequestIds);
//        if (ewasteRequests.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No EWasteRequests found for given IDs");
//        }
//
//        // Update OtherCompany for each EWasteRequest
//        for (EWasteRequest ewasteRequest : ewasteRequests) {
//            ewasteRequest.setOtherCompany(otherCompany);
//        }
//
//        // Save updated requests
//        ewasteRequestRepository.saveAll(ewasteRequests);
//
//        return ResponseEntity.ok("OtherCompany assigned successfully to the provided EWasteRequests.");
//    }

//    @PostMapping("/assign-other-company")
//    public ResponseEntity<String> assignOtherCompany(
//            @RequestParam int otherCompanyId,
//            @RequestBody List<Integer> ewasteRequestIds) {
//
//        if (ewasteRequestIds.isEmpty()) {
//            return ResponseEntity.badRequest().body("No EWasteRequest ID provided.");
//        }
//
//        // Fetch the OtherCompany
//        Optional<OtherCompany> otherCompanyOptional = otherCompanyRepository.findById(otherCompanyId);
//        if (!otherCompanyOptional.isPresent()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("OtherCompany not found.");
//        }
//        OtherCompany otherCompany = otherCompanyOptional.get();
//
//        // Fetch the first EWasteRequest to get ewasteTypeId
//        Optional<EWasteRequest> eWasteRequestOptional = ewasteRequestRepository.findById(ewasteRequestIds.get(0));
//        if (!eWasteRequestOptional.isPresent()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("EWasteRequest not found.");
//        }
//        EWasteRequest eWasteRequest = eWasteRequestOptional.get();
//        int ewasteTypeId = eWasteRequest.getE_waste_types().getId();  // Assuming getter for ewasteType
//
//        // Find all BidItems with the same ewasteTypeId and status 'un-sold'
//        List<BidItem> bidItems = bidItemRepository.findByEWasteTypes_IdAndStatusIgnoreCase(ewasteTypeId, "un-sold");
//
//        if (bidItems.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No unsold BidItems found for this EWasteType.");
//        }
//
//        // Update the status field to the OtherCompany name
//        for (BidItem bidItem : bidItems) {
//            bidItem.setStatus(otherCompany.getName());
//        }
//
//        bidItemRepository.saveAll(bidItems);
//
//        return ResponseEntity.ok("OtherCompany assigned successfully to all matching BidItems.");
//    }

    @PostMapping("/assign-other-company")
    public ResponseEntity<String> assignOtherCompany(
            @RequestParam int otherCompanyId,
            @RequestBody List<Integer> ewasteRequestIds) {

        if (ewasteRequestIds.isEmpty()) {
            return ResponseEntity.badRequest().body("No EWasteRequest ID provided.");
        }

        // Fetch the OtherCompany
        Optional<OtherCompany> otherCompanyOptional = otherCompanyRepository.findById(otherCompanyId);
        if (!otherCompanyOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("OtherCompany not found.");
        }
        OtherCompany otherCompany = otherCompanyOptional.get();

        // Fetch all EWasteRequests in the provided list and set their otherCompanyId
        List<EWasteRequest> updatedRequests = new ArrayList<>();
        for (Integer requestId : ewasteRequestIds) {
            Optional<EWasteRequest> eWasteRequestOptional = ewasteRequestRepository.findById(requestId);
            if (!eWasteRequestOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("EWasteRequest with ID " + requestId + " not found.");
            }
            EWasteRequest eWasteRequest = eWasteRequestOptional.get();

            // Assign OtherCompany to EWasteRequest
            eWasteRequest.setOtherCompany(otherCompany);
            updatedRequests.add(eWasteRequest);
        }

        // Save all updated EWasteRequests
        ewasteRequestRepository.saveAll(updatedRequests);

        // Fetch the first EWasteRequest to get ewasteTypeId (original logic)
        Optional<EWasteRequest> firstEWasteRequestOptional = ewasteRequestRepository.findById(ewasteRequestIds.get(0));
        if (!firstEWasteRequestOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("EWasteRequest not found.");
        }
        EWasteRequest firstEWasteRequest = firstEWasteRequestOptional.get();
        int ewasteTypeId = firstEWasteRequest.getE_waste_types().getId();

        // Find all BidItems with the same ewasteTypeId and status 'un-sold'
        List<BidItem> bidItems = bidItemRepository.findByEWasteTypes_IdAndStatusIgnoreCase(ewasteTypeId, "un-sold");

        if (bidItems.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No unsold BidItems found for this EWasteType.");
        }

        // Update the status field to the OtherCompany name
        for (BidItem bidItem : bidItems) {
            bidItem.setStatus(otherCompany.getName());
        }

        bidItemRepository.saveAll(bidItems);

        return ResponseEntity.ok("OtherCompany assigned successfully to all matching EWasteRequests and BidItems.");
    }





}
