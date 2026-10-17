import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaRegAddressCard ,   FaLock, FaSignOutAlt } from 'react-icons/fa';
import { FaCodePullRequest } from "react-icons/fa6";
import { AiOutlineTransaction } from "react-icons/ai";
import { BiData } from "react-icons/bi";


export default function OtherCompanyDashboard() {
  return (
    <div className="admin-dashboard-container">
      <div className="sidebar">
        <h3 className="orange-text">Other-Company Dashboard</h3>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="ManageBidding" className="nav-link">
                <FaCodePullRequest  rking className="nav-icon" /> Manage Bidding
              </Link>
            </li>
             
            <li>
              <Link to="UpdatedPasswordForOtherCompany" className="nav-link"> 
                <FaLock className="nav-icon" /> Update Password
              </Link>
            </li>
            <li>
              <Link to="/" className="nav-link logout">
                <FaSignOutAlt className="nav-icon" /> Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
