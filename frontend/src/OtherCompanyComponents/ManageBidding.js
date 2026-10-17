import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { baseUrl } from "../App";

const ManageBidding = () => {
  const [bids, setBids] = useState([]);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showAllBidsModal, setShowAllBidsModal] = useState(false);
  const [bidPrice, setBidPrice] = useState("");
  const [selectedBidItemId, setSelectedBidItemId] = useState(null);
  const [allBids, setAllBids] = useState([]);

  const email = sessionStorage.getItem("email"); // Fetch email from session storage

  useEffect(() => {
    axios
      .get(`${baseUrl}/bids`)
      .then((response) => {
        setBids(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bids:", error);
      });
  }, []);

  const handlePlaceBid = (bidItemId) => {
    setSelectedBidItemId(bidItemId);
    setShowBidModal(true);
  };

  const handleShowAllBids = (bidItemId) => {
    axios
      .get(`${baseUrl}/all`)
      .then((response) => {
        const filteredBids = response.data.filter((bid) => bid.bidItem?.id === bidItemId);
        console.log("Filtered Bids:", filteredBids); // Log the filtered bids
        setAllBids(filteredBids);
        setShowAllBidsModal(true);
      })
      .catch((error) => {
        console.error("Error fetching all bids:", error);
      });
  };
  

  const handleSubmitBid = () => {
    if (!bidPrice) {
      alert("Please enter a bid price.");
      return;
    }

    const bidData = {
      bidItemId: selectedBidItemId,
      email: email,
      bidPrice: bidPrice,
    };

    axios
      .post(`${baseUrl}/place`, bidData)
      .then(() => {
        alert("Bid placed successfully!");
        setShowBidModal(false);
        setBidPrice("");
      })
      .catch((error) => {
        console.error("Error placing bid:", error);
        alert("Failed to place bid. Try again.");
      });
  };

  return (
    <Container>
      <h2 className="my-4 text-start">Manage Bidding</h2>
      <Row>
        {bids.length > 0 ? (
          bids.map((bid) => (
            <Col md={4} key={bid.id} className="mb-4">
              <Card className="text-start">
                <Card.Body>
                  <Card.Title>
                    <strong>{bid.eWasteTypes.name}</strong>
                  </Card.Title>
                  <Card.Text>
                    <strong>Base Price:</strong> ₹{bid.basePrice} <br />
                    <strong>Stock Count:</strong> {bid.stockCount} <br />
                    <strong>Description:</strong> {bid.description} <br />
                    <strong>Status:</strong> {bid.status === "un-sold" ? "Unsold" : `${bid.status} Sold`} <br />

                    <strong>Last Date for Bidding:</strong> {bid.lastdte} <br />
                  </Card.Text>
                  <Button
  variant="primary"
  onClick={() => handlePlaceBid(bid.id)}
  disabled={new Date(bid.lastdte) < new Date()} // Disable if last date has passed
>
  Place Bid
</Button>

                  <Button
                    variant="info"
                    className="my-2"
                    onClick={() => handleShowAllBids(bid.id)}
                  >
                    Show Bidding
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-start">No bids available.</p>
        )}
      </Row>

      {/* Bid Modal */}
      <Modal show={showBidModal} onHide={() => setShowBidModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Place Your Bid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Bid Price</Form.Label>
              <Form.Control
                type="number"
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
                placeholder="Enter your bid price"
              />
            </Form.Group>
            <Button className="mt-3" variant="success" onClick={handleSubmitBid}>
              Submit Bid
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Show All Bids Modal */}
      <Modal show={showAllBidsModal} onHide={() => setShowAllBidsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>All Bids</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {allBids.length > 0 ? (
            <ul>
              {allBids.map((bid) => (
                <li key={bid.id}>
                   <strong>Company:</strong> {bid.otherCompany ? bid.otherCompany.name : "N/A"} <br />
                  <strong>Bid Price:</strong> ₹{bid.bidPrice}
                </li>
              ))}
            </ul>
          ) : (
            <p>No bids available for this item.</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageBidding;