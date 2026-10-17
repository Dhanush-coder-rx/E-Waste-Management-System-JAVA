import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaRegAddressCard ,   FaLock, FaSignOutAlt } from 'react-icons/fa';
import { FaCodePullRequest } from "react-icons/fa6";
import { AiOutlineTransaction } from "react-icons/ai";
import { BiData } from "react-icons/bi";


export default function AdminDashboard() {
  return (
    <div className="admin-dashboard-container">
      <div className="sidebar">
        <h3 className="orange-text">Admin Dashboard</h3>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="ManageUserRequests" className="nav-link">
                <FaCodePullRequest  rking className="nav-icon" /> Manage User Requests
              </Link>
            </li>
            <li>
              <Link to="ManagePickups" className="nav-link">
                <FaRegAddressCard className="nav-icon" /> Manage Pickups
              </Link>
            </li>
            <li>
              <Link to="BidStocks" className="nav-link">
                <BiData  className="nav-icon" /> Bid Stocks
              </Link>
            </li>
           
            <li>
              <Link to="FinancialTransactions" className="nav-link">
                <AiOutlineTransaction  className="nav-icon" />Financial Transactions
              </Link>
            </li>
            <li>
              <Link to="ManageDeliveryBoys" className="nav-link">
                <FaRegAddressCard className="nav-icon" /> Manage DeliveryBoys
              </Link>
            </li>
           
            <li>
              <Link to="UpdatedPasswordForAdmin" className="nav-link"> 
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
