package com.example.e_waste.Repository;

import com.example.e_waste.Entity.AssignWaste;
import com.example.e_waste.Entity.DeliveryBoy;
import com.example.e_waste.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssignWasteRepository extends JpaRepository<AssignWaste, Integer> {

    List<AssignWaste> findByDeliveryBoy(DeliveryBoy deliveryBoy);

    List<AssignWaste> findByPriceNotNull();

    List<AssignWaste> findByPriceNotNullAndEWasteRequest_OtherCompanyIsNull();

    List<AssignWaste> findByEWasteRequest_UserAndPriceIsNotNull(User user);





}
