// CreateTaskModal.jsx - Modified version
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal, Stack } from "react-bootstrap";
import toast from "react-hot-toast";

const CreateTaskModal = ({
  showCreateModal,
  handleCreateModalClose,
  setTasks,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleCreateTask = async () => {
    if (!startDate || !dueDate) {
      toast.error("Please set both start and due dates");
      return;
    }

    console.log('Start Date:', startDate);
    console.log('Due Date:', dueDate);
    
    const startDateTime = new Date(startDate).toISOString();
    const dueDateTime = new Date(dueDate).toISOString();
    
    // Add these console logs
    console.log('Start DateTime:', startDateTime);
    console.log('Due DateTime:', dueDateTime);
  
    // Add explicit validation
    if (new Date(dueDateTime) < new Date(startDateTime)) {
      toast.error("Due date must be after or equal to start date");
      return;
    }
    await axios
      .post(
        "http://localhost:4000/api/v1/task/post",
        { 
          title, 
          description, 
          startDate: startDateTime,
          dueDate: dueDateTime,
          priority
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setTasks((prevTasks) => [...prevTasks, res.data.task]);
        setTitle("");
        setDescription("");
        setStartDate("");
        setDueDate("");
        
        
        handleCreateModalClose();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <>
      <Modal show={showCreateModal} onHide={handleCreateModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3}>
            <label>Title</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Stack>
          <br />
          <Stack gap={3}>
            <label>Description</label>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
          <br />
          <Stack gap={3}>
            <label>Start Date</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Stack>
          <br />
          <Stack gap={3}>
  <label>Due Date</label>
  <input
    type="datetime-local"
    value={dueDate}
    min={startDate} // This ensures the due date can't be before start date
    onChange={(e) => {
      const newDueDate = e.target.value;
      if (newDueDate >= startDate) {
        setDueDate(newDueDate);
      } else {
        toast.error("Due date cannot be earlier than start date");
      }
    }}
  />
</Stack>
          <Stack gap={3}>
        <label>Priority</label>
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value)}
          className="form-select"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCreateModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateTask}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateTaskModal;