import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Card, Container, Row, Col, Table, Form } from "react-bootstrap";
import { baseUrl } from "../App";

const BidStocks = () => {
  const [requests, setRequests] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showBidModal, setShowBidModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [bids, setBids] = useState([]);
  const [otherCompany ,setOtherCompany]= useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedSoldCategory, setSelectedSoldCategory] = useState("");
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState([]);
  const [summary, setSummary] = useState({});
  const [formData, setFormData] = useState({
    basePrice: "",
    description: "",
    lastdate: "",
    status: "un-sold",
    requestIds: [],
  });

  const fetchPaidRequests = () => {
    axios
      .get(`${baseUrl}/paidRequests`)
      .then((response) => {
        setRequests(response.data);
        calculateSummary(response.data);
      })
      .catch((error) => {
        console.error("Error fetching paid requests:", error);
      });
  };
  
  // Call fetchPaidRequests inside useEffect
  useEffect(() => {
    fetchPaidRequests();
  }, []);

  useEffect(() => {
    axios
      .get(`${baseUrl}/getAllOtherCompany`)
      .then((response) => {
        setOtherCompany(response.data);
        
      })
      .catch((error) => {
        console.error("Error fetching paid requests:", error);
      });
  }, []);

  // Function to calculate total count & total price per category
  const calculateSummary = (data) => {
    const summaryData = {};
    data.forEach((request) => {
      const category = request.ewasteTypeName;
      if (!summaryData[category]) {
        summaryData[category] = { count: 0, totalPrice: 0 };
      }
      summaryData[category].count += 1;
      summaryData[category].totalPrice += request.price;
    });
    setSummary(summaryData);
  };

  // Open Bid Modal
  const handleBidOpen = (category) => {
    const requestIds = requests
      .filter((request) => request.ewasteTypeName === category)
      .map((request) => request.ewasteRequestId);
    setSelectedCategory(category);
    setFormData({ ...formData, requestIds });
    setShowBidModal(true);
  };

  // Open Feedback Modal
  const handleShowFeedback = (feedbacks) => {
    setSelectedFeedback(feedbacks);
    setShowFeedbackModal(true);
  };

  // Function to render stars based on rating
  const renderStars = (rating) => "⭐".repeat(rating);

  // Submit bid data
  const handleConfirmBid = () => {
    console.log("Form Data before sending bid request:", formData);
    axios
      .post(`${baseUrl}/e-waste-request/bid-open`, formData)
      .then((response) => {
        console.log("Bid Open Response:", response.data);
        alert("Bid Opened Successfully!");
        setShowBidModal(false);
      })
      .catch((error) => {
        console.error("Error opening bid:", error);
      });
  };

  const handleShowBidding = (category) => {
    axios
      .get(`${baseUrl}/all`)
      .then((response) => {
        // Filter bids based on the selected category
        const filteredBids = response.data.filter(
          (bid) => bid.bidItem.eWasteTypes.name === category
        );
  
        setBids(filteredBids);
        setSelectedCategory(category);
        setShowBiddingModal(true);
      })
      .catch((error) => {
        console.error("Error fetching bids:", error);
      });
  };

   // Open Sold Modal
   const handleSoldOpen = (category) => {
    setSelectedSoldCategory(category);
    setShowSoldModal(true);
  };

  // Handle Sold Confirmation
  const handleConfirmSold = () => {
    if (!selectedCompany) {
      alert("Please select a company before confirming the sale.");
      return;
    }

    const requestIds = requests
      .filter((request) => request.ewasteTypeName === selectedSoldCategory)
      .map((request) => request.ewasteRequestId);

    axios
      .post(`${baseUrl}/assign-other-company?otherCompanyId=${selectedCompany}`, requestIds, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        fetchPaidRequests();
        alert("Stock Sold Successfully!");
        setShowSoldModal(false);
      })
      .catch((error) => {
        console.error("Error selling stock:", error);
      });
  };
  

  return (
    <Container>
      <h2 className="my-4 text-start">Paid Requests</h2>

      {/* Summary Table */}
      {Object.keys(summary).length > 0 && (
        <div className="mb-4">
          <h4>Summary</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Total Stocks</th>
                <th>Total Price (₹)</th>
                <th>Action</th>
                <th>Sold</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary).map(([category, data], index) => (
                <tr key={category}>
                  <td>{index + 1}</td>
                  <td>{category}</td>
                  <td>{data.count}</td>
                  <td>₹{data.totalPrice.toFixed(2)}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleBidOpen(category)} className="mb-2">
                      Bid
                    </Button>
                    <Button variant="danger" onClick={() => handleShowBidding(category)}>
                      Show Bidding
                    </Button>
                  </td>
                  <td> <Button variant="success" onClick={() => handleSoldOpen(category)} className="mt-3">
                      Sold 
                    </Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}


       {/* Sold Modal */}
       <Modal show={showSoldModal} onHide={() => setShowSoldModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sell Stock for {selectedSoldCategory}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select Company</Form.Label>
              <Form.Select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
                <option value="">Select a Company</option>
                {otherCompany.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSoldModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirmSold}>
            Confirm Sold
          </Button>
        </Modal.Footer>
      </Modal>


        {/* Show Bidding Modal */}
        <Modal show={showBiddingModal} onHide={() => setShowBiddingModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Bidding Details - {selectedCategory}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bids.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Bid ID</th>
                  <th>Bidder Name</th>
                  <th>Bid Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid) => (
                  <tr key={bid.id}>
                    <td>{bid.id}</td>
                    <td>{bid.otherCompany.name}</td>
                    <td>₹{bid.bidPrice}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No bids available for this category.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBiddingModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>



      {/* Requests Cards */}
      <Row>
        {requests.length > 0 ? (
          requests.map((request) => (
            <Col md={4} key={request.ewasteRequestId} className="mb-4">
              <Card className="text-start">
                <Card.Body>
                  <Card.Title>
                    <strong>{request.ewasteTypeName}</strong>
                  </Card.Title>
                  <Card.Text>
                    <strong>E-Waste Request ID:</strong> {request.ewasteRequestId} <br />
                    <strong>Price:</strong> ₹{request.price} <br />
                  </Card.Text>

                  {/* Feedback Button */}
                  {request.feedbacks.length > 0 ? (
                    <Button variant="link" onClick={() => handleShowFeedback(request.feedbacks)}>
                      See Feedback
                    </Button>
                  ) : (
                    <p>No feedback available.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-start">No paid requests available.</p>
        )}
      </Row>

      {/* Bid Modal */}
      <Modal show={showBidModal} onHide={() => setShowBidModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Open Bid - {selectedCategory}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Base Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter base price"
                name="basePrice"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
  <Form.Label>Last Date for Bid</Form.Label>
  <Form.Control
    type="date"
    placeholder="Enter last date"
    name="lastdate"
    value={formData.lastdate}
    onChange={(e) => setFormData({ ...formData, lastdate: e.target.value })}
  />
</Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" value="un-sold" disabled />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBidModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirmBid}>
            Confirm Bid
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFeedback.length > 0 ? (
            <ul>
              {selectedFeedback.map((feedback, index) => (
                <li key={index}>
                  <strong>Comments:</strong> {feedback.comments} <br />
                  <strong>Rating:</strong> {renderStars(feedback.rating)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No feedback available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BidStocks;
