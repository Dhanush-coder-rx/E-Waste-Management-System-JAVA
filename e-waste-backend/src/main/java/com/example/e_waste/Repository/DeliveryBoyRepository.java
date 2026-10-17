package com.example.e_waste.Repository;

import com.example.e_waste.Entity.DeliveryBoy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeliveryBoyRepository extends JpaRepository<DeliveryBoy,Integer > {
    Optional<DeliveryBoy> findByEmail (String email);

}
