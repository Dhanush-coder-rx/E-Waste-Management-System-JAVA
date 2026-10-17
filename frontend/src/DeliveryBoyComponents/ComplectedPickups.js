import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { baseUrl } from "../App";

const CompletedPickups = () => {
  const [completedPickups, setCompletedPickups] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const email = sessionStorage.getItem("email");

  useEffect(() => {
    fetchCompletedPickups();
  }, [email]);

  const fetchCompletedPickups = () => {
    if (email) {
      axios
        .get(`${baseUrl}/assignedWaste/${email}`)
        .then((response) => {
          // Store only pickups where payment has some value (completed)
          const paidPickups = response.data.filter(
            (pickup) => pickup.eWasteRequest.payment
          );

          setCompletedPickups(paidPickups);
        //   toast.success("Completed pickups fetched successfully!");
        })
        .catch((error) => {
          console.error("Error fetching completed pickups:", error);
          toast.error("Failed to fetch completed pickups.");
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-start">Completed Pickups</h2>
      {completedPickups.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Assign Date</th>
              <th>User Name</th>
              <th>Mobile</th>
              <th>Waste Type</th>
              <th>Pickup Date</th>
              <th>Pickup Time</th>
              <th>Location</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {completedPickups.map((pickup) => (
              <tr key={pickup.id}>
                <td>{pickup.assignDate}</td>
                <td>{pickup.eWasteRequest.user.name}</td>
                <td>{pickup.eWasteRequest.user.mobile}</td>
                <td>{pickup.eWasteRequest.e_waste_types.name}</td>
                <td>{pickup.eWasteRequest.pickDate}</td>
                <td>{pickup.eWasteRequest.pickTime}</td>
                <td>
                  <a
                    href={pickup.eWasteRequest.pickupLocation}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Location
                  </a>
                </td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => {
                      setSelectedImage(pickup.eWasteRequest.image);
                      setShowModal(true);
                    }}
                  >
                    View Image
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-start">No completed pickups available.</p>
      )}

      {/* Image Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pickup Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedImage ? (
            <img
              src={`data:image/jpeg;base64,${selectedImage}`}
              alt="E-Waste"
              className="img-fluid"
            />
          ) : (
            <p>No Image Available</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CompletedPickups;
