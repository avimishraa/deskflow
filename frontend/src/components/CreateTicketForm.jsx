import { useState } from "react";

import toast from "react-hot-toast";

import API from "../api/ticketApi";

function CreateTicketForm({
  fetchTickets
}) {
  const [formData, setFormData] =
    useState({
      subject: "",
      description: "",
      customerEmail: "",
      priority: "low"
    });

  const [errors, setErrors] =
    useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject =
        "Subject is required";
    }

    if (
      !formData.description.trim()
    ) {
      newErrors.description =
        "Description is required";
    }

    if (
      !/^\S+@\S+\.\S+$/.test(
        formData.customerEmail
      )
    ) {
      newErrors.customerEmail =
        "Valid email required";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await API.post(
        "/tickets",
        formData
      );

      toast.success(
        "Ticket created"
      );

      setFormData({
        subject: "",
        description: "",
        customerEmail: "",
        priority: "low"
      });

      setErrors({});

      fetchTickets();
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Error creating ticket"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
marginBottom: "30px",
display: "flex",
flexDirection: "column",
gap: "12px",
background: "white",
padding: "24px",
borderRadius: "18px",
boxShadow:
"0 4px 12px rgba(0,0,0,0.08)"
}}
    >
      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={formData.subject}
        onChange={handleChange}
        style={{
padding: "12px",
borderRadius: "10px",
border: "1px solid #d1d5db",
fontSize: "15px"
}}

      />

      {errors.subject && (
        <p style={{ color: "red" }}>
          {errors.subject}
        </p>
      )}

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        rows="4"
        style={{
          padding: "10px",
          borderRadius: "6px",
          border:
            "1px solid #ccc"
        }}
      />

      {errors.description && (
        <p style={{ color: "red" }}>
          {errors.description}
        </p>
      )}

      <input
        type="email"
        name="customerEmail"
        placeholder="Customer Email"
        value={
          formData.customerEmail
        }
        onChange={handleChange}
        style={{
          padding: "10px",
          borderRadius: "6px",
          border:
            "1px solid #ccc"
        }}
      />

      {errors.customerEmail && (
        <p style={{ color: "red" }}>
          {
            errors.customerEmail
          }
        </p>
      )}

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        style={{
          padding: "10px",
          borderRadius: "6px",
          border:
            "1px solid #ccc"
        }}
      >
        <option value="low">
          Low
        </option>

        <option value="medium">
          Medium
        </option>

        <option value="high">
          High
        </option>

        <option value="urgent">
          Urgent
        </option>
      </select>

      <button
        type="submit"
        style={{
          padding: "12px",
          border: "none",
          borderRadius: "8px",
          background: "#2563eb",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Create Ticket
      </button>
    </form>
  );
}

export default CreateTicketForm;