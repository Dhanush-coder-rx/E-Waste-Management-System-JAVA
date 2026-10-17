package com.example.e_waste.Controller;

import com.example.e_waste.DTO.LoginDTO;
import com.example.e_waste.Repository.AdminRepository;
import com.example.e_waste.Repository.DeliveryBoyRepository;
import com.example.e_waste.Repository.OtherCompanyRepository;
import com.example.e_waste.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtherCompanyRepository otherCompanyRepository;

    @Autowired
    private DeliveryBoyRepository deliveryBoyRepository;

    @Autowired
    private AdminRepository adminRepository;



    @PostMapping("/login")
    public ResponseEntity<?> Login(@RequestBody LoginDTO loginDTO){

        if (loginDTO.getUsertype().equalsIgnoreCase("User")) {
            var user = userRepository.findByEmail(loginDTO.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (loginDTO.getPassword().equals(user.getPassword())) {
                return new ResponseEntity<>("User", HttpStatus.OK);

            } else {
                return new ResponseEntity<>("User Password not Match", HttpStatus.UNAUTHORIZED);
            }
        }  else if (loginDTO.getUsertype().equalsIgnoreCase("DeliveryBoy")) {
            var delivery = deliveryBoyRepository.findByEmail(loginDTO.getEmail())
                    .orElseThrow(() -> new RuntimeException("DeliveryBoy not found"));

            if (loginDTO.getPassword().equals(delivery.getPassword())) {
                return new ResponseEntity<>("DeliveryBoy", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("DeliveryBoy Password not Match", HttpStatus.UNAUTHORIZED);

            }
        }

        else if (loginDTO.getUsertype().equalsIgnoreCase("OtherCompany")) {
            var otherCompany = otherCompanyRepository.findByEmail(loginDTO.getEmail())
                    .orElseThrow(() -> new RuntimeException("OtherCompany not found"));

            if (loginDTO.getPassword().equals(otherCompany.getPassword())) {
                return new ResponseEntity<>("OtherCompany", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("OtherCompany Password not Match", HttpStatus.UNAUTHORIZED);

            }
        }
        else if (loginDTO.getUsertype().equalsIgnoreCase("Admin")) {
            var admin = adminRepository.findByEmail(loginDTO.getEmail())
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            if (loginDTO.getPassword().equals(admin.getPassword())) {
                return new ResponseEntity<>("Admin", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Admin Password not Match", HttpStatus.UNAUTHORIZED);
            }
        }
        else  {
            return new ResponseEntity<>("Invalid User Type", HttpStatus.BAD_REQUEST);
        }
    }
}
