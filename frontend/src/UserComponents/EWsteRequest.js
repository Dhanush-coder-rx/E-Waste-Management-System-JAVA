import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Card, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../App";

const EWasteRequest = () => {
  const [eWasteTypes, setEWasteTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [regDate, setRegDate] = useState(new Date().toISOString().split("T")[0]);
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickTime, setPickTime] = useState("");
  const [pickDate, setPickDate] = useState('');

  // Ref for resetting file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${baseUrl}/e-waste-types/all`)
      .then((response) => setEWasteTypes(response.data))
      .catch((error) => console.error("Error fetching e-waste types:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = sessionStorage.getItem("email");
    if (!email) {
      toast.error("User not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("eWasteTypeId", selectedType);
    if (image) formData.append("image", image);
    formData.append("description",description);
    formData.append("regDate", regDate);
    formData.append("pickupLocation", pickupLocation);
    formData.append("pickDate", pickDate)
    formData.append("pickTime", pickTime);

    try {
      await axios.post(`${baseUrl}/e-waste-request`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("E-Waste Request Submitted Successfully");

      // Reset form fields after success
      setSelectedType("");
      setImage(null);
      setPickupLocation("");
      setPickTime("");
      setDescription("");

      // Reset file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Error submitting request");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mt-4">
      <Card className="p-4">
        <h3 className="text-center">Request E-Waste Pickup</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>E-Waste Type</Form.Label>
            <Form.Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              required
            >
              <option value="">Select Type</option>
              {eWasteTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              ref={fileInputRef} // Attach ref
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group className="mt-3">
  <Form.Label>Description</Form.Label>
  <Form.Control
    as="textarea"
    rows={2} // You can adjust the number of rows
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    required
  />
</Form.Group>


          <Form.Group className="mt-3">
            <Form.Label>Registration Date</Form.Label>
            <Form.Control type="date" value={regDate} readOnly />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Pickup Location</Form.Label>
            <Form.Control
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Pickup Date</Form.Label>
            <Form.Control type="date" value={pickDate} 
            onChange={(e) => setPickDate(e.target.value)} />
          </Form.Group>



          

          <Form.Group className="mt-3">
            <Form.Label>Pickup  Time Above</Form.Label>
            <Form.Control
              type="text"
              value={pickTime}
              placeholder="EX : 5PM "
              onChange={(e) => setPickTime(e.target.value)}
              required
            />
          </Form.Group>

          <Button className="mt-3 w-100" type="submit" variant="primary">
            Submit Request
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default EWasteRequest;
