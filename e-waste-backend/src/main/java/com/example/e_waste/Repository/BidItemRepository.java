package com.example.e_waste.Repository;

import com.example.e_waste.Entity.BidItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BidItemRepository extends JpaRepository<BidItem , Integer> {

    List<BidItem> findByEWasteTypes_IdAndStatusIgnoreCase(int eWasteTypesId, String status);


}
