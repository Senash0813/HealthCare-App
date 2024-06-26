import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation, Link } from "react-router-dom";

export default function UpdatePatient() {
  const location = useLocation();
  const [formData, setFormData] = useState(location.state || []);
  const [isEdit, setIsEdit] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [serviceOptions, setServiceOptions] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [price, setPrice] = useState(""); // State for price

  useEffect(() => {
    if (location.state) {
      setFormData(location.state);
      setPatientId(location.state._id);
    } else {
      setPatientId(id);
    }
  }, [location.state, id]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/patients/get/${patientId}`);
        setFormData(response.data.patient);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("An error occurred while fetching patient data.");
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  useEffect(() => {
    axios.get("http://localhost:8070/services/")
      .then(response => {
        setServiceOptions(response.data);
      })
      .catch(error => {
        console.error("Error fetching service options:", error);
      });
  }, []);

  useEffect(() => {
    // Find the selected service
    const selectedService = serviceOptions.find(option => option.name === formData.service);
    // Update the price based on the selected service
    if (selectedService) {
      setPrice(selectedService.price);
    }
  }, [formData.service, serviceOptions]);

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleConfirm = async () => {
    if (!patientId) {
      setError("Patient ID is missing. Please try again later.");
      return;
    }

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (
      !formData.name ||
      !formData.email ||
      !emailRegex.test(formData.email) ||
      !formData.age ||
      !formData.gender ||
      !formData.address ||
      !formData.tpNumber ||
      !phoneRegex.test(formData.tpNumber) ||
      !formData.service ||
      !formData.time
    ) {
      setErrMsg("Please fill in all fields with valid data.");
      return;
    }

    if (window.confirm("Are you sure you want to update the data?")) {
      try {
        const response = await axios.put(`http://localhost:8070/patients/update/${patientId}`, formData);
        if (response.data.status === "User Updated") {
          alert("Patient updated successfully!");
          setIsEdit(false);
        } else {
          setError("Update failed! Please check the error message from the server.");
        }
      } catch (error) {
        console.error("Error updating patient data:", error);
        if (error.response) {
          console.log("Response data:", error.response.data);
          console.log("Response status:", error.response.status);
          console.log("Response headers:", error.response.headers);
        }
        setError("An error occurred. Please try again later.");
      }
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Update Patient</h2>
      {error && <div className="error">{error}</div>}
      <div>
        {isEdit ? (
          <>
            {errMsg && <div className="error">{errMsg}</div>}
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Telephone Number:</label>
              <input
                type="text"
                name="tpNumber"
                value={formData.tpNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Service:</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {serviceOptions.map(option => (
                  <option key={option._id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input
                type="text"
                name="price"
                value={price}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Time:</label>
              <input
                type="text"
                name="time"
                value={formData.time}
                readOnly
              />
            </div>
          </>
        ) : (
          <>
            <p><strong>Full Name:</strong> {formData.name}</p>
            <p><strong>Age:</strong> {formData.age}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>
            <p><strong>Phone Number:</strong> {formData.tpNumber}</p>
            <p><strong>Address:</strong> {formData.address}</p>
            <p><strong>Service:</strong> {formData.service}</p>
            <p><strong>Price:</strong> {price}</p>
            <p><strong>Time:</strong> {formData.time}</p>
          </>
        )}
      </div>
      <div>
        {isEdit ? (
          <button className="btn btn-primary" onClick={handleConfirm}>
            Update User
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleEdit}>
            Edit
          </button>
        )}
        <Link className="btn btn-primary" to='/dental/success'>
          Confirm
        </Link>
      </div>
    </div>
  );
}
