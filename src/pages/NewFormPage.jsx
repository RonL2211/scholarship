// src/pages/NewFormPage.jsx
import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Accordion,
  Alert,
} from "react-bootstrap";

const inputTypeOptions = [
  { value: "Combo Box", label: "Combo Box" },
  { value: "טקסט קצר", label: "טקסט קצר" },
  { value: "טקסט ארוך", label: "טקסט ארוך" },
  { value: "לינק", label: "לינק" },
  { value: "קובץ", label: "קובץ" },
  { value: "תמונה", label: "תמונה" },
];

function NewFormPage() {
  // שדות הטופס הבסיסיים
  const [formName, setFormName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxFormScore, setMaxFormScore] = useState("");
  const [description, setDescription] = useState("");

  // קריטריונים
  const [criteria, setCriteria] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // פונקציה להוספת קריטריון חדש
  const addCriterion = () => {
    setCriteria([
      ...criteria,
      {
        title: "",
        explanation: "",
        maxScore: "",
        isRequired: false,
        whoFills: "",
        inputTypes: [],
        subCriteria: [],
      },
    ]);
  };

  const updateCriterion = (index, field, value) => {
    const newCriteria = [...criteria];
    newCriteria[index][field] = value;
    setCriteria(newCriteria);
  };

  const updateCriterionInputType = (critIndex, inputIndex, value) => {
    const newCriteria = [...criteria];
    newCriteria[critIndex].inputTypes[inputIndex] = value;
    setCriteria(newCriteria);
  };

  const addCriterionInputType = (critIndex) => {
    const newCriteria = [...criteria];
    newCriteria[critIndex].inputTypes.push("");
    setCriteria(newCriteria);
  };

  const removeCriterion = (index) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  // תתי‑סעיפים
  const addSubCriterion = (critIndex) => {
    const newCriteria = [...criteria];
    newCriteria[critIndex].subCriteria.push({
      title: "",
      explanation: "",
      maxScore: "",
      isRequired: false,
      whoFills: "",
      inputTypes: [],
    });
    setCriteria(newCriteria);
  };

  const updateSubCriterion = (critIndex, subIndex, field, value) => {
    const newCriteria = [...criteria];
    newCriteria[critIndex].subCriteria[subIndex][field] = value;
    setCriteria(newCriteria);
  };

  const updateSubCriterionInputType = (critIndex, subIndex, inputIndex, value) => {
    const newCriteria = [...criteria];
    newCriteria[critIndex].subCriteria[subIndex].inputTypes[inputIndex] = value;
    setCriteria(newCriteria);
  };

  const addSubCriterionInputType = (critIndex, subIndex) => {
    const newCriteria = [...criteria];
    newCriteria[critIndex].subCriteria[subIndex].inputTypes.push("");
    setCriteria(newCriteria);
  };

  const removeSubCriterion = (critIndex, subIndex) => {
    const newCriteria = [...criteria];
    newCriteria[critIndex].subCriteria.splice(subIndex, 1);
    setCriteria(newCriteria);
  };

  // בדיקות תקינות לשדות הטופס הראשיים
  const validateMainForm = () => {
    if (!formName) return "שם הטופס הוא שדה חובה";
    if (!maxFormScore) return "ניקוד מקסימלי לטופס הוא שדה חובה";
    if (!startDate) return "תאריך פתיחה הוא שדה חובה";

    // בדיקת תאריכים
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    if (start < today) return "תאריך פתיחה צריך להיות מהיום והלאה";
    if (dueDate) {
      const due = new Date(dueDate);
      if (due < start) return "תאריך סיום לא יכול להיות לפני תאריך הפתיחה";
    }
    return "";
  };

  // בדיקות תקינות לקריטריונים
  const validateCriteria = () => {
    for (let i = 0; i < criteria.length; i++) {
      const crit = criteria[i];
      if (!crit.title) return `נושא הקריטריון (קריטריון ${i + 1}) הוא שדה חובה`;
      if (!crit.maxScore) return `ניקוד הקריטריון (קריטריון ${i + 1}) הוא שדה חובה`;
      if (!crit.explanation) return `הסבר הקריטריון (קריטריון ${i + 1}) הוא שדה חובה`;
      if (!crit.inputTypes || crit.inputTypes.length === 0 || crit.inputTypes.some((val) => !val)) {
        return `יש לבחור לפחות סוג קלט אחד עבור קריטריון ${i + 1}`;
      }
      // בדיקת תתי‑סעיפים – אם קיימים, כל השדות בהם חובה
      if (crit.subCriteria && crit.subCriteria.length > 0) {
        for (let j = 0; j < crit.subCriteria.length; j++) {
          const sub = crit.subCriteria[j];
          if (!sub.title) return `כותרת תת-קריטריון (קריטריון ${i + 1}, תת-קריטריון ${j + 1}) היא שדה חובה`;
          if (!sub.maxScore) return `ניקוד תת-קריטריון (קריטריון ${i + 1}, תת-קריטריון ${j + 1}) הוא שדה חובה`;
          if (!sub.explanation) return `הסבר תת-קריטריון (קריטריון ${i + 1}, תת-קריטריון ${j + 1}) הוא שדה חובה`;
          if (!sub.inputTypes || sub.inputTypes.length === 0 || sub.inputTypes.some((val) => !val)) {
            return `יש לבחור לפחות סוג קלט אחד עבור תת-קריטריון (קריטריון ${i + 1}, תת-קריטריון ${j + 1})`;
          }
        }
      }
    }
    return "";
  };

  const handleSave = async (publish = false) => {
    setError("");
    setSuccess("");

    const mainError = validateMainForm();
    if (mainError) {
      setError(mainError);
      return;
    }
    const critError = validateCriteria();
    if (critError) {
      setError(critError);
      return;
    }

    const formData = {
      formName,
      startDate,
      dueDate,
      maxFormScore,
      description,
      isPublished: publish,
      criteria,
    };

    try {
      // קריאה ל-API (דוגמה):
      // const response = await fetch("https://localhost:7230/api/Form", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) {
      //   const errText = await response.text();
      //   throw new Error(errText || "Failed to create form");
      // }
      setSuccess(publish ? "הטופס פורסם בהצלחה!" : "הטופס נשמר כטיוטה בהצלחה!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      dir="rtl"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", padding: "20px" }}
    >
      <Card className="p-4 shadow w-100" style={{ maxWidth: "1200px" }}>
        <h4 className="mb-3 text-center">יצירת טופס חדש</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formName">
                <Form.Label>
                  שם הטופס <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="הכנס שם טופס"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="maxFormScore">
                <Form.Label>
                  ניקוד מקסימלי לטופס <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="לדוגמה: 100"
                  value={maxFormScore}
                  onChange={(e) => setMaxFormScore(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="startDate">
                <Form.Label>
                  תאריך פתיחה <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="dueDate">
                <Form.Label>תאריך סיום</Form.Label>
                <Form.Control
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label>תיאור</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="הכנס תיאור כללי על הטופס"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Form>

        <hr />
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">הגדרת קריטריונים</h5>
          <Button variant="primary" onClick={addCriterion}>
            הוסף קריטריון חדש
          </Button>
        </div>

        <div className="mt-3">
          {criteria.map((crit, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>
                        נושא הקריטריון <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="הכנס נושא"
                        value={crit.title}
                        onChange={(e) =>
                          updateCriterion(index, "title", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>
                        ניקוד מקסימלי לקריטריון <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="הכנס ניקוד"
                        value={crit.maxScore}
                        onChange={(e) =>
                          updateCriterion(index, "maxScore", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-2">
                  <Form.Label>
                    הסבר על הקריטריון <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="תיאור/הסבר"
                    value={crit.explanation}
                    onChange={(e) =>
                      updateCriterion(index, "explanation", e.target.value)
                    }
                  />
                </Form.Group>
                <div>
                  <h6>
                    סוגי קלט <span className="text-danger">*</span>
                  </h6>
                  {crit.inputTypes.map((inputVal, inpIndex) => (
                    <Form.Group key={inpIndex} className="mb-2">
                      <Form.Select
                        value={inputVal}
                        onChange={(e) =>
                          updateCriterionInputType(index, inpIndex, e.target.value)
                        }
                      >
                        <option value="">בחר סוג קלט</option>
                        {inputTypeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  ))}
                  <Button variant="secondary" size="sm" onClick={() => addCriterionInputType(index)}>
                    הוסף סוג קלט נוסף
                  </Button>
                </div>

                {/* תתי‑סעיפים */}
                <Accordion className="mt-3">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>תתי סעיפים</Accordion.Header>
                    <Accordion.Body>
                      <Button variant="secondary" size="sm" onClick={() => addSubCriterion(index)}>
                        הוסף תת‑סעיף
                      </Button>
                      <div className="mt-2">
                        {crit.subCriteria.map((sub, sIndex) => (
                          <Card key={sIndex} className="mb-2 p-2">
                            <Row>
                              <Col md={4}>
                                <Form.Group className="mb-2">
                                  <Form.Label>
                                    כותרת תת‑סעיף <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="הכנס כותרת"
                                    value={sub.title}
                                    onChange={(e) =>
                                      updateSubCriterion(index, sIndex, "title", e.target.value)
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group className="mb-2">
                                  <Form.Label>
                                    ניקוד מקסימלי <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Control
                                    type="number"
                                    placeholder="הכנס ניקוד"
                                    value={sub.maxScore}
                                    onChange={(e) =>
                                      updateSubCriterion(index, sIndex, "maxScore", e.target.value)
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group className="mb-2">
                                  <Form.Label>
                                    מי ממלא <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Form.Select
                                    value={sub.whoFills}
                                    onChange={(e) =>
                                      updateSubCriterion(index, sIndex, "whoFills", e.target.value)
                                    }
                                  >
                                    <option value="">בחר</option>
                                    <option value="חבר ועדה">חבר ועדה</option>
                                    <option value="מרצה">מרצה</option>
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                            </Row>
                            <div>
                              <h6>
                                סוגי קלט לתת‑סעיף <span className="text-danger">*</span>
                              </h6>
                              {sub.inputTypes.map((inp, inpIdx) => (
                                <Form.Group key={inpIdx} className="mb-2">
                                  <Form.Select
                                    value={inp}
                                    onChange={(e) =>
                                      updateSubCriterionInputType(index, sIndex, inpIdx, e.target.value)
                                    }
                                  >
                                    <option value="">בחר סוג קלט</option>
                                    {inputTypeOptions.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>
                              ))}
                              <Button variant="secondary" size="sm" onClick={() => addSubCriterionInputType(index, sIndex)}>
                                הוסף סוג קלט נוסף
                              </Button>
                            </div>
                            <Form.Group className="mb-2">
                              <Form.Label>
                                הסבר <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="תיאור/הסבר"
                                value={sub.explanation}
                                onChange={(e) =>
                                  updateSubCriterion(index, sIndex, "explanation", e.target.value)
                                }
                              />
                            </Form.Group>
                            <Form.Check
                              type="checkbox"
                              label="חובה"
                              checked={sub.isRequired}
                              onChange={(e) =>
                                updateSubCriterion(index, sIndex, "isRequired", e.target.checked)
                              }
                            />
                            <div className="mt-2 text-end">
                              <Button variant="danger" size="sm" onClick={() => removeSubCriterion(index, sIndex)}>
                                הסר תת‑סעיף
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <div className="text-end mt-3">
                  <Button variant="danger" size="sm" onClick={() => removeCriterion(index)}>
                    הסר קריטריון
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        <hr />
        <div className="d-flex justify-content-between">
          <Button variant="warning" onClick={() => handleSave(false)}>
            שמור כטיוטה
          </Button>
          <Button variant="success" onClick={() => handleSave(true)}>
            פרסם
          </Button>
        </div>
      </Card>
    </Container>
  );
}

export default NewFormPage;


