import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

const DeleteGroup = ({ show, handleClose, groups = [], handleDelete }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton style={{ backgroundColor: "#e9f7ef" }}>
        <Modal.Title>Remove Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {groups.length === 0 ? (
          <p className="text-center text-muted">No groups found.</p>
        ) : (
          <Table striped bordered hover className="text-center">
            <thead style={{ backgroundColor: "#b2dfdb" }}>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Max-Members</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id} style={{ backgroundColor: "#d9f5dc" }}>
                  <td>{group.id}</td>
                  <td>{group.name}</td>
                  <td>{group.description || "No description"}</td>
                  <td>{group.maxMembers}</td>
                  <td>
                    <Button 
                      variant="danger" 
                      onClick={() => handleDelete(group.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default DeleteGroup;