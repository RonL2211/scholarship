// src/components/forms/BasicFormDetails.jsx
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const BasicFormDetails = ({ formData, updateFormData }) => {
  return (
    <div className="basic-form-details">
      <h5 className="mb-4">פרטי טופס בסיסיים</h5>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="formName">
            <Form.Label>שם הטופס <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="לדוגמה: טופס תגמול מרצים מצטיינים 2025"
              value={formData.formName}
              onChange={(e) => updateFormData("formName", e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="academicYear">
            <Form.Label>שנת לימודים <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="לדוגמה: תשפ״ה"
              value={formData.academicYear}
              onChange={(e) => updateFormData("academicYear", e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="semester">
            <Form.Label>סמסטר</Form.Label>
            <Form.Select
              value={formData.semester}
              onChange={(e) => updateFormData("semester", e.target.value)}
            >
              <option value="">בחר סמסטר</option>
              <option value="א">א</option>
              <option value="ב">ב</option>
              <option value="ק">ק</option>
              <option value="ש">שנתי</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="startDate">
            <Form.Label>תאריך פתיחה <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="date"
              value={formData.startDate}
              onChange={(e) => updateFormData("startDate", e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="dueDate">
            <Form.Label>תאריך סיום</Form.Label>
            <Form.Control
              type="date"
              value={formData.dueDate}
              onChange={(e) => updateFormData("dueDate", e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="description">
            <Form.Label>תיאור הטופס</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="תיאור כללי של הטופס"
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="instructions">
            <Form.Label>הוראות למילוי הטופס</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="הוראות מפורטות למילוי הטופס"
              value={formData.instructions}
              onChange={(e) => updateFormData("instructions", e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col>
          <Form.Check
            type="switch"
            id="isActiveSwitch"
            label="טופס פעיל"
            checked={formData.isActive}
            onChange={(e) => updateFormData("isActive", e.target.checked)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default BasicFormDetails;