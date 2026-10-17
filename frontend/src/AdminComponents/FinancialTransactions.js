import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Modal, Button } from "react-bootstrap";
import { baseUrl } from "../App"; // Import baseUrl

const FinancialTransactions = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedCompanyBids, setSelectedCompanyBids] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");

  // Fetch financial transactions
  useEffect(() => {
    axios
      .get(`${baseUrl}/all`)
      .then((response) => {
        setData(response.data);
        processChartData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  }, []);

  // Process data for Pie Chart
  const processChartData = (transactions) => {
    const companyCounts = {};

    transactions.forEach((item) => {
      const companyName = item.otherCompany.name;
      if (companyCounts[companyName]) {
        companyCounts[companyName]++;
      } else {
        companyCounts[companyName] = 1;
      }
    });

    const formattedData = Object.keys(companyCounts).map((name) => ({
      name,
      value: companyCounts[name],
    }));

    setChartData(formattedData);
  };

  // Handle clicking on a pie section
  const handlePieClick = (entry) => {
    if (entry) {
      const companyName = entry.name;
      setSelectedCompanyName(companyName); // Store selected company name

      // Group all bids by bid item to find the highest bid per item
      const highestBidsByItem = {};
      data.forEach((bid) => {
        const bidItemId = bid.bidItem.id;
        if (!highestBidsByItem[bidItemId] || parseFloat(bid.bidPrice) > parseFloat(highestBidsByItem[bidItemId].bidPrice)) {
          highestBidsByItem[bidItemId] = bid;
        }
      });

      // Filter only bids where the selected company has the highest bid
      const filteredCompanyBids = Object.values(highestBidsByItem).filter(
        (bid) => bid.otherCompany.name === companyName
      );

      setSelectedCompanyBids(filteredCompanyBids);
      setIsModalVisible(true);
    }
  };

  // Custom Tooltip to show only company name
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "#fff", padding: "5px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <p style={{ margin: 0, fontWeight: "bold" }}>{payload[0].payload.name}</p>
        </div>
      );
    }
    return null;
  };

  // Colors for Pie Chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BEF", "#FF5678"];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Financial Transactions Overview</h2>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
  <PieChart width={400} height={400}>
    <Pie
      data={chartData}
      cx="50%"
      cy="50%"
      outerRadius={120}
      fill="#8884d8"
      dataKey="value"
      onClick={handlePieClick}
    >
      {chartData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip content={<CustomTooltip />} />
    <Legend />
  </PieChart>
</div>



      {/* Modal for showing bid details */}
      <Modal show={isModalVisible} onHide={() => setIsModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Bid Details for {selectedCompanyName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCompanyBids.length > 0 ? (
            selectedCompanyBids.map((bid, index) => (
              <div key={index} style={{ marginBottom: "10px", borderBottom: "1px solid #ddd", padding: "10px" }}>
                <strong>Bid Item:</strong> {bid.bidItem.eWasteTypes.name} <br />
                <strong>Status:</strong> {selectedCompanyName} <br />
                <strong>Stock Count:</strong> {bid.bidItem.stockCount} <br />
                <strong>Sold Price:</strong> ₹{bid.bidPrice}
              </div>
            ))
          ) : (
            <p>No bids found where {selectedCompanyName} has the highest bid.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FinancialTransactions;
