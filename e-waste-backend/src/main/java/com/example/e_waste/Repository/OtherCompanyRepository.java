package com.example.e_waste.Repository;

import com.example.e_waste.Entity.OtherCompany;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtherCompanyRepository extends JpaRepository<OtherCompany ,Integer> {

    Optional<OtherCompany> findByEmail (String email);

}
