import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../App";

const ManageUserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [amount, setAmount] = useState({});

  // Function to fetch requests
  const fetchRequests = () => {
    axios
      .get(`${baseUrl}/e-waste-request/processing`)
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
      });
  };

  // Fetch data on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = (id) => {
    const enteredAmount = amount[id];
    if (!enteredAmount) {
      alert("Please enter an amount before approving.");
      return;
    }

    axios
      .put(`${baseUrl}/e-waste-request/${id}/approve?amount=${enteredAmount}`)
      .then(() => {
        toast.success("E-Waste request approved successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        // ✅ Fetch updated data after approval
        fetchRequests();
      })
      .catch((error) => {
        console.error("Error approving request:", error);
        toast.error("Failed to approve request. Try again.");
      });
  };

  return (
    <Container>
      <h2 className="my-4 text-start">Manage E-Waste Requests</h2>
      <Row>
        {requests.length > 0 ? (
          requests.map((request) => (
            <Col md={4} key={request.id} className="mb-4">
              <Card className="text-start">
                <Card.Body>
                  <Card.Title><strong>{request.e_waste_types.name}</strong></Card.Title>
                  <Card.Text>
                    <strong>User:</strong> {request.user.name} <br />
                    <strong>Email:</strong> {request.user.email} <br />
                    <strong>Mobile:</strong> {request.user.mobile} <br />
                    <strong>Pickup Location:</strong>{" "}
                    <a href={request.pickupLocation} target="_blank" rel="noopener noreferrer">
                      View Location
                    </a> <br />
                    <strong>Pickup Date:</strong> {request.pickDate} <br />
                    <strong>Pickup Time:</strong> {request.pickTime} <br />
                    <strong>Registration Date:</strong> {request.regDate} <br />
                    <strong>Description :</strong> {request.description} <br />
                    <strong>Status:</strong> {request.status} <br />
                    <strong>Amount:</strong> {request.amount ? `₹${request.amount}` : "Not set yet"} <br />

                    {/* Amount Input for Approval */}
                    {request.status !== "Approved" && (
                      <>
                        <Form.Control
                          type="number"
                          placeholder="Enter amount"
                          value={amount[request.id] || ""}
                          onChange={(e) => setAmount({ ...amount, [request.id]: e.target.value })}
                        />
                        <Button variant="success" className="mt-2" onClick={() => handleApprove(request.id)}>
                          Approve
                        </Button>
                      </>
                    )}

                    <Button variant="link" onClick={() => setSelectedImage(request.image)}>
                      View Image
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-start">No requests available.</p>
        )}
      </Row>

      {/* Image Modal */}
      <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <img src={`data:image/jpeg;base64,${selectedImage}`} alt="E-Waste Request" className="img-fluid" />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageUserRequests;
