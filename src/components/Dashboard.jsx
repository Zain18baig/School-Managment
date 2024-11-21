import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { db, collection, getDocs } from "../firebase"; // Import necessary Firebase functions
import "../styles/global.css";

const Dashboard = () => {
  const [studentsCount, setStudentsCount] = useState(0); // State to store student count
  const [teachersCount, setTeachersCount] = useState(0); // State to store teacher count

  // Fetch Students Count
  const fetchStudentsCount = async () => {
    try {
      const studentsCollection = collection(db, "students"); // Assuming the collection name is "students"
      const studentSnapshot = await getDocs(studentsCollection);
      const studentList = studentSnapshot.docs.map((doc) => doc.data());
      setStudentsCount(studentList.length); // Set the number of students
    } catch (error) {
      console.error("Error fetching students count: ", error);
    }
  };

  // Fetch Teachers Count
  const fetchTeachersCount = async () => {
    try {
      const teachersCollection = collection(db, "teachers"); // Assuming the collection name is "teachers"
      const teacherSnapshot = await getDocs(teachersCollection);
      const teacherList = teacherSnapshot.docs.map((doc) => doc.data());
      setTeachersCount(teacherList.length); // Set the number of teachers
    } catch (error) {
      console.error("Error fetching teachers count: ", error);
    }
  };

  useEffect(() => {
    fetchStudentsCount(); // Fetch students count on mount
    fetchTeachersCount(); // Fetch teachers count on mount
  }, []);

  return (
    <div className="container mt-4">
      <h1>Dashboard</h1>
      <Row>
        <Col sm={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Students</Card.Title>
              <Card.Text>{studentsCount}</Card.Text>{" "}
              {/* Show number of students */}
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Teachers</Card.Title>
              <Card.Text>{teachersCount}</Card.Text>{" "}
              {/* Show number of teachers */}
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4}>
         
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
