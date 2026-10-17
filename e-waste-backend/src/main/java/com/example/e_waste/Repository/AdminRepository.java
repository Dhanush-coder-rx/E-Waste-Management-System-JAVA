package com.example.e_waste.Repository;

import com.example.e_waste.Entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository <Admin , Integer> {

    Optional<Admin> findByEmail (String email);
}
