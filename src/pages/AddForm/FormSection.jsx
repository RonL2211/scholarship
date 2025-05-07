// src/components/forms/FormSection.jsx
import React from 'react';
import { Card, Tabs, Tab, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const FormSection = ({ 
  section, 
  sectionIndex, 
  updateSection, 
  addField, 
  updateField, 
  removeField, 
  addSubSection, 
  updateSubSection, 
  removeSubSection,
  addFieldOption,
  updateFieldOption,
  removeFieldOption,
  fieldTypeOptions,
  removeSection,
  departments,
  users
}) => {
  return (
    
    <Card className="mb-4 shadow-sm section-card">
      <Card.Header className="d-flex justify-content-between align-items-center bg-light">
        <h6 className="mb-0">
          סעיף {sectionIndex + 1}: {section.title || "סעיף חדש"}
        </h6>
        <Button 
          variant="danger" 
          size="sm" 
          onClick={() => removeSection(sectionIndex)}
        >
          <i className="bi bi-trash"></i>
        </Button>
      </Card.Header>
      <Card.Body>
        <Tabs defaultActiveKey="details" id={`section-tabs-${sectionIndex}`}>
          <Tab eventKey="details" title="פרטי סעיף">
            <div className="p-3">
              <Row className="mb-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>כותרת הסעיף <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="הזן כותרת"
                      value={section.title}
                      onChange={(e) => updateSection(sectionIndex, "title", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>ניקוד מקסימלי <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="הזן ניקוד"
                      value={section.maxPoints}
                      onChange={(e) => updateSection(sectionIndex, "maxPoints", e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>תיאור הסעיף</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="תיאור קצר של הסעיף"
                  value={section.description}
                  onChange={(e) => updateSection(sectionIndex, "description", e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>הסבר למילוי</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="הנחיות למילוי הסעיף"
                  value={section.explanation}
                  onChange={(e) => updateSection(sectionIndex, "explanation", e.target.value)}
                />
              </Form.Group>
              <Form.Check
                type="switch"
                id={`required-switch-${sectionIndex}`}
                label="סעיף חובה"
                checked={section.isRequired}
                onChange={(e) => updateSection(sectionIndex, "isRequired", e.target.checked)}
                className="mb-3"
              />
            </div>
          </Tab>
          <Tab eventKey="advanced" title="הגדרות מתקדמות">
  <div className="p-3">
    <Row className="mb-3">
      <Col md={6}>
        <Form.Group>
          <Form.Label>גורם אחראי</Form.Label>
          <Form.Select
            value={section.responsibleEntity || ""}
            onChange={(e) => updateSection(sectionIndex, "responsibleEntity", e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">בחר גורם אחראי</option>
            {departments.map(dept => (
              <option key={dept.departmentID} value={dept.departmentID}>
                {dept.departmentName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group>
          <Form.Label>אדם אחראי</Form.Label>
          <Form.Select
            value={section.responsiblePerson || ""}
            onChange={(e) => updateSection(sectionIndex, "responsiblePerson", e.target.value)}
          >
            <option value="">בחר אדם אחראי</option>
            {users.map(user => (
              <option key={user.personId} value={user.personId}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
    <Row className="mb-3">
      <Col md={6}>
        <Form.Group>
          <Form.Label>מספר מקסימלי של פעמים למילוי</Form.Label>
          <Form.Control
            type="number"
            min="1"
            placeholder="ברירת מחדל: 1"
            value={section.maxOccurrences || ""}
            onChange={(e) => updateSection(sectionIndex, "maxOccurrences", e.target.value ? parseInt(e.target.value) : 1)}
          />
          <Form.Text className="text-muted">
            כמה פעמים ניתן למלא את הסעיף הזה (למשל, כמה קורסים ניתן להוסיף)
          </Form.Text>
        </Form.Group>
      </Col>
    </Row>
  </div>
</Tab>
          <Tab eventKey="fields" title="שדות">
            <div className="p-3">
              <div className="d-flex justify-content-between mb-3">
                <h6>שדות הסעיף</h6>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => addField(sectionIndex)}
                >
                  <i className="bi bi-plus-lg"></i> הוסף שדה
                </Button>
              </div>
              
              {section.fields.length === 0 ? (
                <Alert variant="light">
                  לא הוגדרו שדות בסעיף זה. הוסף שדה חדש.
                </Alert>
              ) : (
                section.fields.map((field, fieldIndex) => (
                  <Card key={fieldIndex} className="mb-3 border shadow-sm">
                    <Card.Body>
  <div className="d-flex justify-content-between mb-3">
    <h6>שדה {fieldIndex + 1}</h6>
    <Button 
      variant="danger" 
      size="sm"
      onClick={() => removeField(sectionIndex, fieldIndex)}
    >
      <i className="bi bi-trash"></i>
    </Button>
  </div>

  <Tabs defaultActiveKey="basic" id={`field-tabs-${sectionIndex}-${fieldIndex}`}>
    <Tab eventKey="basic" title="פרטים בסיסיים">
      <div className="p-3">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>תווית השדה <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="הזן תווית"
                value={field.fieldLabel}
                onChange={(e) => updateField(sectionIndex, fieldIndex, "fieldLabel", e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>סוג השדה <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={field.fieldType}
                onChange={(e) => updateField(sectionIndex, fieldIndex, "fieldType", e.target.value)}
              >
                <option value="">בחר סוג שדה</option>
                {fieldTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>טקסט מציין מקום (Placeholder)</Form.Label>
              <Form.Control
                type="text"
                placeholder="טקסט שיופיע בשדה לפני מילוי"
                value={field.placeholder || ""}
                onChange={(e) => updateField(sectionIndex, fieldIndex, "placeholder", e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>טקסט עזרה</Form.Label>
              <Form.Control
                type="text"
                placeholder="טקסט הסבר שיוצג תחת השדה"
                value={field.helpText || ""}
                onChange={(e) => updateField(sectionIndex, fieldIndex, "helpText", e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Check
          type="switch"
          id={`required-field-${sectionIndex}-${fieldIndex}`}
          label="שדה חובה"
          checked={field.isRequired}
          onChange={(e) => updateField(sectionIndex, fieldIndex, "isRequired", e.target.checked)}
          className="mb-3"
        />
      </div>
    </Tab>

    <Tab eventKey="advanced" title="הגדרות מתקדמות">
      <div className="p-3">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>שם שדה (זיהוי פנימי)</Form.Label>
              <Form.Control
                type="text"
                placeholder="שם פנימי לזיהוי השדה"
                value={field.fieldName || ""}
                onChange={(e) => updateField(sectionIndex, fieldIndex, "fieldName", e.target.value)}
              />
              <Form.Text className="text-muted">
                שדה זה נועד לזיהוי פנימי. אם לא ימולא, ייווצר מזהה אוטומטי.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>ערך ברירת מחדל</Form.Label>
              <Form.Control
                type="text"
                placeholder="ערך שיופיע כברירת מחדל"
                value={field.defaultValue || ""}
                onChange={(e) => updateField(sectionIndex, fieldIndex, "defaultValue", e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        {['text', 'textarea'].includes(field.fieldType) && (
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>אורך מקסימלי</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="לא מוגבל"
                  value={field.maxLength || ""}
                  onChange={(e) => updateField(sectionIndex, fieldIndex, "maxLength", e.target.value ? parseInt(e.target.value) : null)}
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        {['number', 'range'].includes(field.fieldType) && (
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>ערך מינימלי</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="לא מוגבל"
                  value={field.minValue || ""}
                  onChange={(e) => updateField(sectionIndex, fieldIndex, "minValue", e.target.value ? parseFloat(e.target.value) : null)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>ערך מקסימלי</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="לא מוגבל"
                  value={field.maxValue || ""}
                  onChange={(e) => updateField(sectionIndex, fieldIndex, "maxValue", e.target.value ? parseFloat(e.target.value) : null)}
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>כלל חישוב ניקוד</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="הגדר כלל חישוב מתקדם (אופציונלי)"
                value={field.scoreCalculationRule || ""}
                onChange={(e) => updateField(sectionIndex, fieldIndex, "scoreCalculationRule", e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Check
          type="switch"
          id={`visible-field-${sectionIndex}-${fieldIndex}`}
          label="שדה גלוי"
          checked={field.isVisible !== false}
          onChange={(e) => updateField(sectionIndex, fieldIndex, "isVisible", e.target.checked)}
          className="mb-2"
        />

        <Form.Check
          type="switch"
          id={`active-field-${sectionIndex}-${fieldIndex}`}
          label="שדה פעיל"
          checked={field.isActive !== false}
          onChange={(e) => updateField(sectionIndex, fieldIndex, "isActive", e.target.checked)}
        />
      </div>
    </Tab>
  </Tabs>

  {['select', 'radio', 'checkbox'].includes(field.fieldType) && (
    <div className="field-options mt-4">
      <h6>אפשרויות בחירה</h6>
      {(!field.options || field.options.length === 0) ? (
        <div className="text-center py-2">
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => addFieldOption(sectionIndex, fieldIndex)}
          >
            הוסף אפשרות ראשונה
          </Button>
        </div>
      ) : (
        <>
          {field.options.map((option, optionIndex) => (
            <Row key={optionIndex} className="mb-2 align-items-center">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="תווית האפשרות"
                  value={option.optionLabel}
                  onChange={(e) => updateFieldOption(sectionIndex, fieldIndex, optionIndex, "optionLabel", e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="number"
                  placeholder="ערך ניקוד"
                  value={option.scoreValue}
                  onChange={(e) => updateFieldOption(sectionIndex, fieldIndex, optionIndex, "scoreValue", e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Check
                  type="switch"
                  label="ברירת מחדל"
                  checked={option.isDefault}
                  onChange={(e) => updateFieldOption(sectionIndex, fieldIndex, optionIndex, "isDefault", e.target.checked)}
                />
              </Col>
              <Col md={1}>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => removeFieldOption(sectionIndex, fieldIndex, optionIndex)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </Col>
            </Row>
          ))}

          <div className="text-center mt-2">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => addFieldOption(sectionIndex, fieldIndex)}
            >
              <i className="bi bi-plus-lg"></i> הוסף אפשרות נוספת
            </Button>
          </div>
        </>
      )}
    </div>
  )}
</Card.Body>

                  </Card>
                ))
              )}
            </div>
          </Tab>
          
          <Tab eventKey="subSections" title="תתי-סעיפים">
            <div className="p-3">
              <div className="d-flex justify-content-between mb-3">
                <h6>תתי-סעיפים</h6>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => addSubSection(sectionIndex)}
                >
                  <i className="bi bi-plus-lg"></i> הוסף תת-סעיף
                </Button>
              </div>
              
              {(!section.subSections || section.subSections.length === 0) ? (
                <Alert variant="light">
                  לא הוגדרו תתי-סעיפים. הוסף תת-סעיף חדש.
                </Alert>
              ) : (
                section.subSections.map((subSection, subIndex) => (
                  <Card key={subIndex} className="mb-3 border shadow-sm">
                    <Card.Header className="bg-light">
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-0">
                          תת-סעיף {subIndex + 1}: {subSection.title || "תת-סעיף חדש"}
                        </h6>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => removeSubSection(sectionIndex, subIndex)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      {/* תוכן תת-הסעיף יהיה כאן */}
                      <Row className="mb-3">
                        <Col md={8}>
                          <Form.Group>
                            <Form.Label>כותרת תת-הסעיף <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="הזן כותרת"
                              value={subSection.title}
                              onChange={(e) => updateSubSection(sectionIndex, subIndex, "title", e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>ניקוד מקסימלי <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="הזן ניקוד"
                              value={subSection.maxPoints}
                              onChange={(e) => updateSubSection(sectionIndex, subIndex, "maxPoints", e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>הסבר תת-הסעיף</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="הסבר על תת-הסעיף"
                          value={subSection.explanation}
                          onChange={(e) => updateSubSection(sectionIndex, subIndex, "explanation", e.target.value)}
                        />
                      </Form.Group>
                      <Form.Check
                        type="switch"
                        id={`required-subsection-${sectionIndex}-${subIndex}`}
                        label="תת-סעיף חובה"
                        checked={subSection.isRequired}
                        onChange={(e) => updateSubSection(sectionIndex, subIndex, "isRequired", e.target.checked)}
                      />
                    </Card.Body>
                  </Card>
                ))
              )}
            </div>
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default FormSection;