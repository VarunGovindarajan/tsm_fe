import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal, Stack } from "react-bootstrap";
import toast from "react-hot-toast";

const UpdateTaskModal = ({
  showUpdateModal,
  handleUpdateModalClose,
  id,
  setTasks,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("incomplete");
  const [archived, setArchived] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    const getSingleTask = async () => {
      await axios
        .get(`https://ts-backend-r7jg.onrender.com/api/v1/task/single/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setTitle(res.data.task.title);
          setDescription(res.data.task.description);
          setStatus(res.data.task.status);
          setArchived(res.data.task.archived);
          // Fix the date formatting
          setStartDate(res.data.task.startDate ? res.data.task.startDate.slice(0, 16) : "");
          setDueDate(res.data.task.dueDate ? res.data.task.dueDate.slice(0, 16) : "");
          setPriority(res.data.task.priority || "medium");

        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    };
    if (id) {
      getSingleTask();
    }
  }, [id]);

  const handleUpdateTask = async () => {
    if (!startDate || !dueDate) {
      toast.error("Please set both start and due dates");
      return;
    }

    const startDateTime = new Date(startDate).toISOString();
    const dueDateTime = new Date(dueDate).toISOString();

    await axios
      .put(
        `https://ts-backend-r7jg.onrender.com/api/v1/task/update/${id}`,
        {
          title,
          description,
          status,
          archived,
          startDate: startDateTime,
          dueDate: dueDateTime,
          priority,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((task) => {
            if (task._id === id) {
              return res.data.task;
            }
            return task;
          });
          return updatedTasks;
        });
        handleUpdateModalClose();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <>
      <Modal show={showUpdateModal} onHide={handleUpdateModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={2}>
            <label>Title</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Stack>
          <br />
          <Stack gap={2}>
            <label>Description</label>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
          <br />
          <Stack gap={2}>
            <label>Start Date</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Stack>
          <br />
          <Stack gap={2}>
            <label>Due Date</label>
            <input
              type="datetime-local"
              value={dueDate}
              min={startDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Stack>
          <br />
          <Stack gap={2}>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="completed">COMPLETED</option>
              <option value="incomplete">INCOMPLETE</option>
            </select>
          </Stack>
          <br />
          <Stack gap={2}>
            <label>Archived</label>
            <select
              value={archived}
              onChange={(e) => setArchived(e.target.value)}
            >
              <option value={true}>YES</option>
              <option value={false}>NO</option>
            </select>
          </Stack>
          <Stack gap={2}>
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
          <Button variant="secondary" onClick={handleUpdateModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateTask}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateTaskModal;