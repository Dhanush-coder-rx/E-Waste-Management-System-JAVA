import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { baseUrl } from "../App";

const ManagePickups = () => {
  const [requests, setRequests] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState({});
  const [assignDates, setAssignDates] = useState({});

  // Fetch E-Waste Requests
  useEffect(() => {
    axios.get(`${baseUrl}/e-waste-request/approvedd`)
      .then(response => setRequests(response.data))
      .catch(error => console.error("Error fetching requests:", error));
  }, []);

  // Fetch Delivery Boys
  useEffect(() => {
    axios.get(`${baseUrl}/deliveryBoys`)
      .then(response => setDeliveryBoys(response.data))
      .catch(error => console.error("Error fetching delivery boys:", error));
  }, []);

  
// Fetch E-Waste Requests Again
const fetchRequests = () => {
  axios.get(`${baseUrl}/e-waste-request/approvedd`)
    .then(response => setRequests(response.data))
    .catch(error => console.error("Error fetching requests:", error));
};

// Handle Assign Delivery Boy
const handleAssign = (requestId) => {
  const deliveryBoyId = selectedDeliveryBoy[requestId];
  const assignDate = assignDates[requestId];

  if (!deliveryBoyId || !assignDate) {
    toast.error("Please select a delivery boy and date.");
    return;
  }

  console.log("Assigning Request:", { requestId, deliveryBoyId, assignDate });

  axios.post(`${baseUrl}/assignWaste`, null, {
    params: {
      requestId,
      deliveryBoyId,
      assignDate,
    },
  })
    .then(() => {
      toast.success("Delivery boy assigned successfully!");
      fetchRequests(); // Fetch updated requests after assignment
    })
    .catch(error => {
      console.error("Error assigning delivery boy:", error);
      toast.error("Failed to assign delivery boy.");
    });
};


  return (
    <Container>
      <h2 className="my-4 text-start">Manage E-Waste Requests</h2>
      <Row>
        {requests.length > 0 ? (
          requests.map((request) => (
            <Col md={4} key={request.id} className="mb-4">
              <Card className="text-start shadow-sm">
                <Card.Body>
                  <Card.Title><strong>{request.e_waste_types?.name}</strong></Card.Title>
                  <Card.Text>
                    <strong>User:</strong> {request.user?.name} <br />
                    <strong>Email:</strong> {request.user?.email} <br />
                    <strong>Mobile:</strong> {request.user?.mobile} <br />
                    <strong>Pickup Location:</strong>{" "}
                    <a href={request.pickupLocation} target="_blank" rel="noopener noreferrer">
                      View Location
                    </a> <br />
                    <strong>Pickup Date:</strong> {request.pickDate} <br />
                    <strong>Pickup Time:</strong> {request.pickTime} <br />
                    <strong>Registration Date:</strong> {request.regDate} <br />
                    <strong>Status:</strong> {request.status} <br />
                    <strong>Amount:</strong> {request.amount ? `₹${request.amount}` : "Not set yet"} <br />
                  </Card.Text>

                  {/* Assign Delivery Boy Section */}
                  <Form.Group>
                    <Form.Label><strong>Assign Delivery Boy:</strong></Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedDeliveryBoy[request.id] || ""}
                      onChange={(e) =>
                        setSelectedDeliveryBoy(prev => ({ ...prev, [request.id]: e.target.value }))
                      }
                    >
                      <option value="">Select Delivery Boy</option>
                      {deliveryBoys.map(boy => (
                        <option key={boy.id} value={boy.id}>{boy.name}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  {/* Assign Date Input */}
                  <Form.Group className="mt-3">
                    <Form.Label><strong>Assign Date:</strong></Form.Label>
                    <Form.Control
                      type="date"
                      value={assignDates[request.id] || ""}
                      onChange={(e) =>
                        setAssignDates(prev => ({ ...prev, [request.id]: e.target.value }))
                      }
                    />
                  </Form.Group>

                  {/* Assign Button */}
                  <Button className="mt-3" variant="primary" onClick={() => handleAssign(request.id)}>
                    Assign
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-start">No requests available.</p>
        )}
      </Row>
    </Container>
  );
};

export default ManagePickups;
