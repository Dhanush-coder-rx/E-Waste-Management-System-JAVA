import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "./App";
import './Login.css'; // Import the CSS file

export default function Login() {
  const [usertype, setUsertype] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Handle login submission
  async function handleLogin(e) {
    e.preventDefault();

    // Validate that usertype is selected
    if (!usertype) {
      alert("Please select a usertype.");
      return;
    }

    const data = { usertype, email, password };
    console.log("Login Data:", { usertype, email, password });
    try {
      // Axios POST request to login API
      const res = await axios.post(baseUrl + "/login", data, {
        headers: { "Content-Type": "application/json" },
      });

      // Store email in session storage
      sessionStorage.setItem("email", email);

      // Redirect based on response
      if (res.data === "Admin") {
        alert("Login successful as Admin");
        navigate("/adminDashboard");
      } else if (res.data === "DeliveryBoy"){
        alert("Login successful as DeliveryBoy");
        navigate("/deliveryBoyDashboard");
      } else if (res.data === "OtherCompany"){
        alert("Login successful as OtherCompany");
        navigate("/otherCompanyDashboard");
      }
       else if (res.data === "User") {
        alert("Login successful as User");
        navigate("/userDashboard");
      } else {
        alert("Invalid Credentials");
      }
    } catch (error) {
      // Error handling with detailed messages
      if (error.response) {
        console.error("Server error:", error.response.status, error.response.data);
        alert("Login failed: " + (error.response.data.message || "Unauthorized"));
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Login failed: No response from server");
      } else {
        console.error("Error:", error.message);
        alert("Login failed: " + error.message);
      }
    }
  }

  return (
    <div className="bg-image">
      <div className="w-50 card mx-auto p-4">
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleLogin}>
          {/* Usertype dropdown */}
          <select
            className="text-center form-select my-3"
            value={usertype}
            onChange={(e) => setUsertype(e.target.value)}
          >
            <option value="">-----Select Usertype------</option>
            <option value="User">User</option>
            <option value="DeliveryBoy">DeliveryBoy</option>
            <option value="OtherCompany">OtherCompany</option>
            <option value="Admin">Admin</option>

          </select>

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

          {/* Registration link */}
          <Link to="/reg" className="d-block mb-3">
            Don't have an account? Click here to Register
          </Link>

          {/* Submit button */}
          <div>
            <button type="submit" className="btn btn-primary mt-4">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
