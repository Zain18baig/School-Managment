import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase"; // Ensure firebase is configured correctly
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import "../styles/global.css";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    fatherName: "",
    className: "",
    teacher: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), (snapshot) => {
      const studentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsData);
    });

    return () => unsubscribe();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  // Add a new student
  const handleAddStudent = async () => {
    if (
      !newStudent.name ||
      !newStudent.fatherName ||
      !newStudent.className ||
      !newStudent.teacher
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingStudent) {
        // Update student
        const studentDocRef = doc(db, "students", editingStudent.id);
        await updateDoc(studentDocRef, newStudent);
        toast.success("Student updated successfully!");
        setEditingStudent(null);
      } else {
        // Add new student
        await addDoc(collection(db, "students"), newStudent);
        toast.success("Student added successfully!");
      }
      setNewStudent({ name: "", fatherName: "", className: "", teacher: "" });
    } catch (error) {
      console.error("Error saving student: ", error);
      toast.error("Failed to save student. Please try again.");
    }
  };

  // Edit student
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setNewStudent(student);
  };

  // Delete student
  const handleDeleteStudent = async (id) => {
    try {
      await deleteDoc(doc(db, "students", id));
      toast.success("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student: ", error);
      toast.error("Failed to delete student. Please try again.");
    }
  };

  // Filter students by search term
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-dark">Manage Students</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Students Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Father's Name</th>
            <th>Class</th>
            <th>Teacher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.fatherName}</td>
              <td>{student.className}</td>
              <td>{student.teacher}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditStudent(student)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Student Form */}
      <div className="card mt-4 bg-light text-dark">
        <div className="card-header">
          <h5>{editingStudent ? "Edit Student" : "Add New Student"}</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Student Name"
              name="name"
              value={newStudent.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Father's Name"
              name="fatherName"
              value={newStudent.fatherName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Class"
              name="className"
              value={newStudent.className}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Teacher"
              name="teacher"
              value={newStudent.teacher}
              onChange={handleInputChange}
            />
            <button
              className={`btn ${
                editingStudent ? "btn-primary" : "btn-success"
              } mt-3`}
              onClick={handleAddStudent}
            >
              {editingStudent ? "Update Student" : "Add Student"}
            </button>
            {editingStudent && (
              <button
                className="btn btn-secondary mt-3 ms-2"
                onClick={() => {
                  setEditingStudent(null);
                  setNewStudent({
                    name: "",
                    fatherName: "",
                    className: "",
                    teacher: "",
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
