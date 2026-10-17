import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { baseUrl } from "../App";

const ManageDeliveryBoys = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [editId, setEditId] = useState(null); // track edit mode

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = () => {
    axios
      .get(`${baseUrl}/deliveryBoys`)
      .then((res) => setDeliveryBoys(res.data))
      .catch((err) => console.error("Error fetching delivery boys:", err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId !== null) {
      // Edit Mode
      axios
        .put(`${baseUrl}/updateDeliveryBoy/${editId}`, formData)
        .then(() => {
          toast.success("Delivery boy updated successfully!");
          resetForm();
          fetchDeliveryBoys();
        })
        .catch(() => toast.error("Error updating delivery boy"));
    } else {
      // Create Mode
      axios
        .post(`${baseUrl}/registerDeliveryBoy`, formData)
        .then(() => {
          toast.success("Delivery boy added successfully!");
          resetForm();
          fetchDeliveryBoys();
        })
        .catch(() => toast.error("Error adding delivery boy"));
    }
  };

  const handleEdit = (boy) => {
    setEditId(boy.id);
    setFormData({
      name: boy.name,
      email: boy.email,
      password: boy.password || "", // assuming password is available; otherwise handle securely
      mobile: boy.mobile,
    });
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", mobile: "" });
    setEditId(null);
  };

  return (
    <Container>
      <h3 className="my-4 text-start">Manage Delivery Boys</h3>

      {/* Add/Edit Delivery Boy Form */}
      <Card className="mb-4 text-start">
        <Card.Body>
          <Card.Title>{editId ? "Edit Delivery Boy" : "Add Delivery Boy"}</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button variant={editId ? "warning" : "primary"} type="submit">
                {editId ? "Update" : "Register"}
              </Button>
              {editId && (
                <Button variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Delivery Boys Table */}
      <Card className="text-start">
        <Card.Body>
          <Card.Title>Registered Delivery Boys</Card.Title>
          {deliveryBoys.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {deliveryBoys.map((boy, index) => (
                  <tr key={boy.id}>
                    <td>{index + 1}</td>
                    <td>{boy.name}</td>
                    <td>{boy.email}</td>
                    <td>{boy.mobile}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleEdit(boy)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No delivery boys registered yet.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ManageDeliveryBoys;
