import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { baseUrl } from "../App";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewRequest = () => {
  const [requests, setRequests] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({ comments: "", rating: 0 });
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  
  const email = sessionStorage.getItem("email");

  useEffect(() => {
    if (email) {
      axios
        .get(`${baseUrl}/e-waste-request/${email}`)
        .then((response) => {
          setRequests(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [email]);

  const handleFeedbackSubmit = () => {
    if (!feedback.comments || feedback.rating === 0) {
      toast.error("Please provide comments and a rating.");
      return;
    }

    const feedbackData = {
      comments: feedback.comments,
      rating: feedback.rating,
      date: new Date().toISOString().split("T")[0], // Current date
      assign_waste_id: { id: selectedRequestId },
      user: { id: 2 }, // Replace with actual user ID
    };

    axios
      .post(`${baseUrl}/add-feedback`, feedbackData)
      .then(() => {
        toast.success("Feedback submitted successfully!");
        setShowFeedbackModal(false);
        setFeedback({ comments: "", rating: 0 });
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        toast.error("Failed to submit feedback.");
      });
  };

  return (
    <Container>
    {requests.length > 0 && (
  <h2 className="my-4 text-start">Welcome {requests[0].user.name}</h2>
)}
      <Row>
  {requests.length > 0 ? (
    requests
      .filter((request) => request.payment !== "Paid") // Exclude records where payment is "Paid"
      .map((request) => (
        <Col md={4} key={request.id} className="mb-4">
          <Card className="text-start">
            <Card.Body>
              <Card.Title><strong>{request.e_waste_types.name}</strong></Card.Title>
              <Card.Text>
                {/* <strong>User:</strong> {request.user.name} <br /> */}
                {/* <strong>Email:</strong> {request.user.email} <br />
                <strong>Mobile:</strong> {request.user.mobile} <br /> */}
                <strong>Pickup Location:</strong>{" "}
                <a href={request.pickupLocation} target="_blank" rel="noopener noreferrer">
                  View Location
                </a> <br />
                <strong>Description:</strong> {request.description} <br />
                <strong>Pickup Date:</strong> {request.pickDate} <br />
                <strong>Pickup Time:</strong> {request.pickTime} <br />
                <strong>Registration Date:</strong> {request.regDate} <br />
                <strong>Status:</strong> {request.status} <br />
                <strong>Amount:</strong> {request.amount ? `₹${request.amount}` : "Not set yet"} <br />
                <strong>Payment:</strong> {request.payment && request.payment !== "null" ? request.payment : "Not Paid"} <br />

                <Button variant="link" onClick={() => setSelectedImage(request.image)}>
                  View Image
                </Button>

                {request.payment && request.payment !== "null" && (
                  <Button
                    variant="primary"
                    className="ms-2"
                    onClick={() => {
                      setSelectedRequestId(request.id);
                      setShowFeedbackModal(true);
                    }}
                  >
                    Give Feedback
                  </Button>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))
  ) : (
    <p className="text-start">No upcoming pickup requests available.</p>
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

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={feedback.comments}
                onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                placeholder="Write your feedback..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setFeedback({ ...feedback, rating: star })}
                    style={{
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      color: star <= feedback.rating ? "#FFD700" : "#ccc",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </Form.Group>
            <Button variant="primary" onClick={handleFeedbackSubmit}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ViewRequest;
