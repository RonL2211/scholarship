// src/pages/CommitteeFormsPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getToken } from "../services/authService";

function CommitteeFormsPage() {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const response = await fetch("https://localhost:7230/api/Form", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to fetch forms");
      }
      const data = await response.json();
      setForms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" dir="rtl">
      <Row className="mb-3 align-items-center">
        <Col xs={12} md={6}>
          <h2 className="text-center">טפסים קיימים</h2>
        </Col>
        <Col xs={12} md={6} className="text-md-start text-center mt-2 mt-md-0">
          <Link to="/committee/create-form">
            <Button variant="primary">+ יצירת טופס חדש</Button>
          </Link>
        </Col>
      </Row>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && forms.length === 0 && (
        <Alert variant="info">אין טפסים קיימים כרגע.</Alert>
      )}

      <Row>
        {forms.map((form) => (
          <Col key={form.FormID} xs={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{form.FormName}</Card.Title>
                <Card.Text>
                  <strong>תאריך יצירה:</strong>{" "}
                  {form.CreationDate
                    ? new Date(form.CreationDate).toLocaleDateString()
                    : "לא זמין"}
                  <br />
                  <strong>תאריך סיום:</strong>{" "}
                  {form.DueDate
                    ? new Date(form.DueDate).toLocaleDateString()
                    : "לא זמין"}
                </Card.Text>
                <Link to={`/committee/edit-form/${form.FormID}`}>
                  <Button variant="outline-primary" size="sm">
                    צפייה / עריכה
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CommitteeFormsPage;



