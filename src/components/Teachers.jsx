import React, { useState, useEffect } from "react";
import {
  db,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "../firebase";
import { toast } from "react-toastify";
import "../styles/global.css";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    designation: "",
    subject: "",
    className: "",
  });
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State to store search query

  const fetchTeachers = async () => {
    try {
      const teachersCollection = collection(db, "teachers");
      const teacherSnapshot = await getDocs(teachersCollection);
      const teacherList = teacherSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeachers(teacherList);
    } catch (error) {
      console.error("Error fetching teachers: ", error);
      toast.error("Error fetching teachers.");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher({ ...newTeacher, [name]: value });
  };

  const handleAddTeacher = async () => {
    if (
      !newTeacher.name ||
      !newTeacher.designation ||
      !newTeacher.subject ||
      !newTeacher.className
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const teacherRef = collection(db, "teachers");
      const newTeacherDoc = await addDoc(teacherRef, newTeacher);
      setTeachers([...teachers, { id: newTeacherDoc.id, ...newTeacher }]);
      setNewTeacher({ name: "", designation: "", subject: "", className: "" });
      toast.success("Teacher added successfully!");
    } catch (error) {
      console.error("Error adding teacher: ", error);
      toast.error("Error adding teacher.");
    }
  };

  const handleEditTeacher = async (teacher) => {
    setEditingTeacher(teacher);
    setNewTeacher({ ...teacher });
  };

  const handleUpdateTeacher = async () => {
    if (
      !newTeacher.name ||
      !newTeacher.designation ||
      !newTeacher.subject ||
      !newTeacher.className
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const teacherRef = doc(db, "teachers", editingTeacher.id);
      await updateDoc(teacherRef, newTeacher);
      setTeachers(
        teachers.map((teacher) =>
          teacher.id === editingTeacher.id
            ? { ...teacher, ...newTeacher }
            : teacher
        )
      );
      setEditingTeacher(null);
      setNewTeacher({ name: "", designation: "", subject: "", className: "" });
      toast.success("Teacher updated successfully!");
    } catch (error) {
      console.error("Error updating teacher: ", error);
      toast.error("Error updating teacher.");
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      const teacherRef = doc(db, "teachers", id);
      await deleteDoc(teacherRef);
      setTeachers(teachers.filter((teacher) => teacher.id !== id));
      toast.success("Teacher deleted successfully!");
    } catch (error) {
      console.error("Error deleting teacher: ", error);
      toast.error("Error deleting teacher.");
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-dark">Manage Teachers</h2>

      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Teachers"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Teachers Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>Teacher Name</th>
            <th>Designation</th>
            <th>Subject</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.map((teacher, index) => (
            <tr key={teacher.id}>
              <td>{index + 1}</td>
              <td>{teacher.name}</td>
              <td>{teacher.designation}</td>
              <td>{teacher.subject}</td>
              <td>{teacher.className}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditTeacher(teacher)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteTeacher(teacher.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Teacher Form */}
      <div className="card mt-4 bg-light text-dark">
        <div className="card-header">
          <h5>{editingTeacher ? "Edit Teacher" : "Add New Teacher"}</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Teacher Name"
              name="name"
              value={newTeacher.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Designation"
              name="designation"
              value={newTeacher.designation}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Subject"
              name="subject"
              value={newTeacher.subject}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Class"
              name="className"
              value={newTeacher.className}
              onChange={handleInputChange}
            />
            <button
              className={`btn ${
                editingTeacher ? "btn-primary" : "btn-success"
              } mt-3`}
              onClick={editingTeacher ? handleUpdateTeacher : handleAddTeacher}
            >
              {editingTeacher ? "Update Teacher" : "Add Teacher"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teachers;
