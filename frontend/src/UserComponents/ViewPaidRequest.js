import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../App";

const ViewPaidRequest = () => {
  const [requests, setRequests] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [feedback, setFeedback] = useState({ comments: "", rating: 0 });
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const userEmail = sessionStorage.getItem("email");

  useEffect(() => {
    if (userEmail) {
      axios
        .get(`${baseUrl}/paidRequests/${userEmail}`)
        .then((response) => {
          setRequests(response.data);
        })
        .catch((error) => {
          console.error("Error fetching paid requests:", error);
        });
    }
  }, [userEmail]);

  const handleFeedbackSubmit = async () => {
    if (!feedback.rating || !feedback.comments) {
      toast.error("Please provide both rating and comment.");
      return;
    }

    const feedbackData = {
      comments: feedback.comments,
      rating: feedback.rating,
      date: new Date().toISOString().split("T")[0], // Current date
      assignWaste: { id: selectedRequestId },
      user: { email: userEmail }, // Send email instead of static user ID
    };

    console.log("Submitting feedback data:", feedbackData);

    try {
      await axios.post(`${baseUrl}/add-feedback`, feedbackData, {
        headers: { "Content-Type": "application/json" },
      });

      // Close modal before showing success message to update UI instantly
      setShowFeedbackModal(false);

      // Reset feedback state
      setFeedback({ comments: "", rating: 0 });

      toast.success("Feedback submitted successfully!");
    } catch (error) {
      toast.error("Error submitting feedback. Please try again.");
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <Container>
      <h2 className="my-4 text-start">Paid Requests</h2>
      <Row>
        {requests.length > 0 ? (
          requests.map((request) => (
            <Col md={4} key={request.id} className="mb-4">
              <Card className="text-start">
                <Card.Body>
                  <Card.Title>
                    <strong>{request.eWasteRequest?.e_waste_types?.name}</strong>
                  </Card.Title>
                  <Card.Text>
                    <strong>Amount:</strong> ₹{request.eWasteRequest?.amount} <br />
                    
                      <Button variant="link" onClick={() => setSelectedImage(request.eWasteRequest?.image)}>
                        View Image
                      </Button>
                  
                    <Button
                      variant="primary"
                      className="mt-2"
                      onClick={() => {
                        setSelectedRequestId(request.id);
                        setShowFeedbackModal(true);
                      }}
                    >
                      Give Feedback
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-start">No paid requests available.</p>
        )}
      </Row>

      {/* Image Modal */}
      <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && <img src={`data:image/jpeg;base64,${selectedImage}`} alt="E-Waste Request" className="img-fluid" />}
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

export default ViewPaidRequest;
