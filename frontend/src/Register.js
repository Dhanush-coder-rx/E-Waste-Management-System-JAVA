import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "./App";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState(""); // Added state for name
  const [usertype, setUsertype] = useState(""); // State to store usertype (User or Lender)
  const navigate = useNavigate();

  // Handle registration
  async function handleRegister(e) {
    e.preventDefault();

    // Validate mobile number length
    if (!/^\d{10}$/.test(mobile)) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }

    // Ensure usertype is selected
    if (!usertype) {
      alert("Please select a usertype.");
      return;
    }

    const data = { email, password, mobile, name };

    const registerUrl = usertype === "User" ? "/registerUser" : "/registerOtherCompany"; // Select URL based on usertype

    axios
      .post(baseUrl + registerUrl, data)
      .then(() => {
        alert("Registration successful! You can now login.");
        setTimeout(() => navigate("/login"), 1000); // Redirect to login after success
      })
      .catch((error) => {
        console.error("Registration error:", error);
        alert("Failed to register. Please try again.");
      });
  }

  return (
    <div className="bg-image">
      <div className="w-50 card mx-auto p-4">
        <h2 className="text-center">Register</h2>
        <form onSubmit={handleRegister}>
          {/* Usertype dropdown */}
          <select
            className="form-select mb-3"
            value={usertype}
            onChange={(e) => setUsertype(e.target.value)}
            required
          >
            <option value="">-----Select Usertype------</option>
            <option value="User">User</option>
            <option value="OtherCompany">OtherCompany</option>
          </select>

          {/* Name input */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email input */}
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password input */}
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Mobile number input */}
          <input
            type="tel"
            className="form-control mb-3"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />

          {/* Submit button */}
          <div>
            <button type="submit" className="btn btn-danger mt-4">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
