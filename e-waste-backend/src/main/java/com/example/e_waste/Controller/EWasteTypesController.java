package com.example.e_waste.Controller;

import com.example.e_waste.Entity.EWasteTypes;
import com.example.e_waste.Repository.EWasteTypesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")
public class EWasteTypesController {

    @Autowired
    private EWasteTypesRepository eWasteTypesRepository;

    @GetMapping("/e-waste-types/all")
    public ResponseEntity<List<EWasteTypes>> getAllEWasteTypes() {
        List<EWasteTypes> eWasteTypesList = eWasteTypesRepository.findAll();
        return ResponseEntity.ok(eWasteTypesList);
    }

}
