import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { baseUrl } from "../App";

const ManagePickupsForDeliveryBoy = () => {
  const [assignedPickups, setAssignedPickups] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const email = sessionStorage.getItem("email");

  useEffect(() => {
    fetchAssignedPickups();
  }, [email]);

  const fetchAssignedPickups = () => {
    if (email) {
      axios
        .get(`${baseUrl}/assignedWaste/${email}`)
        .then((response) => {
          // Filter out pickups where payment has a value
          const unpaidPickups = response.data.filter(
            (pickup) => !pickup.eWasteRequest.payment
          );
  
          setAssignedPickups(unpaidPickups); // Store only unpaid pickups
         
        })
        .catch((error) => {
          console.error("Error fetching assigned pickups:", error);
          toast.error("Failed to fetch assigned pickups.");
        });
    }
  };
  

  const handlePicked = (id) => {
    axios
      .put(`${baseUrl}/assignedWaste/${id}/pay`)
      .then(() => {
        toast.success("Pickup marked as paid successfully!");
        fetchAssignedPickups(); // Refresh the list after updating
      })
      .catch((error) => {
        console.error("Error updating payment:", error);
        toast.error("Failed to update payment status.");
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-start">My Assigned Pickups</h2>
      {assignedPickups.length > 0 ? (
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignedPickups.map((pickup) => (
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
    setSelectedImage(pickup.eWasteRequest.image); // ✅ correct
    setShowModal(true);
  }}
>

                    View Image
                  </Button>
                </td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => handlePicked(pickup.id)}
                  >
                    Picked
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-start">No assigned pickups available.</p>
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

export default ManagePickupsForDeliveryBoy;
