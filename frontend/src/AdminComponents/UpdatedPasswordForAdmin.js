import React, { useState } from "react";
import { Card, Col, Row, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { baseUrl } from "../App"; // Import baseUrl

const UpdatedPasswordForAdmin = () => {
  const storedEmail = sessionStorage.getItem("email"); // Fetch email from sessionStorage
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = () => {
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast.warning("All fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    fetch(`${baseUrl}/updatePasswordForAdmin`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: storedEmail, oldPassword, newPassword, confirmPassword }),
    })
      .then((res) => res.text())
      .then((message) => {
        if (message.includes("successfully")) {
          toast.success(message);
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          toast.error(message);
        }
      })
      .catch(() => toast.error("Failed to update password!"));
  };

  return (
    <Row className="justify-content-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <Col md={6}>
        <Card>
          <Card.Body>
            <h5>Update Password</h5>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={storedEmail} disabled />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleUpdatePassword}>
              Update Password
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default UpdatedPasswordForAdmin;
