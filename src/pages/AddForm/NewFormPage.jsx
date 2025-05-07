// src/pages/NewFormPage.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Alert,
  Tabs,
  Tab,
  Spinner
} from "react-bootstrap";
import StepProgress from "./StepProgress";
import useFormData from "./useFormData";

import {
  createForm,
  createFormSection,
  createSectionField,
  createFieldOption,
  publishForm,
  getDepartments,
  getUsers
} from "./formService";
// רכיבים משניים
import BasicFormDetails from "./BasicFormDetails";
import FormSection from "./FormSection";

const fieldTypeOptions = [
  { value: "text", label: "טקסט קצר" },
  { value: "textarea", label: "טקסט ארוך" },
  { value: "number", label: "מספר" },
  { value: "date", label: "תאריך" },
  { value: "select", label: "תיבת בחירה" },
  { value: "checkbox", label: "תיבת סימון" },
  { value: "radio", label: "כפתורי רדיו" },
  { value: "file", label: "העלאת קובץ" },
  { value: "url", label: "כתובת אינטרנט" },
  { value: "email", label: "דוא״ל" },
];

function NewFormPage() {
  // מספר השלבים
  const totalSteps = 3;
  const [activeStep, setActiveStep] = useState(1);
  
  // ניהול נתוני הטופס
  const {
    formBasicDetails,
    mainSections,
    error,
    success,
    loading,
    formProgress,
    updateFormBasicDetails,
    setFormId,
    addMainSection,
    updateMainSection,
    setSectionId,
    addFieldToMainSection,
    addSubSection,
    calculateCompletion,
    validateForm,
    setError,
    setSuccess,
    setLoading,
    setFormProgress,
    setMainSections
  } = useFormData();

  // עדכון אחוז ההתקדמות בכל פעם שהנתונים משתנים
  useEffect(() => {
    const completion = calculateCompletion();
    setFormProgress(completion);
  }, [formBasicDetails, mainSections]);

  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getDepartments();
        setDepartments(result);
        const users = await getUsers();
        setUsers(users);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
  
    fetchData();
  }, []);

  // מעבר לשלב הבא
  const nextStep = () => {
    // בדיקת תקינות בהתאם לשלב
    let validationError = '';
    
    if (activeStep === 1) {
      // בדיקת פרטים בסיסיים
      if (!formBasicDetails.formName) validationError = 'שם הטופס הוא שדה חובה';
      else if (!formBasicDetails.academicYear) validationError = 'שנת לימודים היא שדה חובה';
      else if (!formBasicDetails.startDate) validationError = 'תאריך התחלה הוא שדה חובה';
    }
    else if (activeStep === 2) {
      // בדיקת סעיפים
      if (mainSections.length === 0) {
        validationError = 'יש להוסיף לפחות סעיף ראשי אחד';
      } else {
        // בדיקת כל סעיף
        for (let i = 0; i < mainSections.length; i++) {
          const section = mainSections[i];
          if (!section.title) {
            validationError = `כותרת חסרה בסעיף ${i + 1}`;
            break;
          }
          if (!section.maxPoints) {
            validationError = `ניקוד מקסימלי חסר בסעיף ${i + 1}`;
            break;
          }
          // בדיקת שדות
          if (section.fields.length === 0) {
            validationError = `יש להוסיף לפחות שדה אחד לסעיף ${i + 1}`;
            break;
          }
        }
      }
    }
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    setActiveStep(prev => Math.min(prev + 1, totalSteps));
  };

  // חזרה לשלב הקודם
  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  // שמירת הטופס
  const handleSave = async (publish = false) => {
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // 1. שמירת הטופס הבסיסי
      const formData = {
        formName: formBasicDetails.formName,
        academicYear: formBasicDetails.academicYear,
        semester: formBasicDetails.semester,
        description: formBasicDetails.description,
        instructions: formBasicDetails.instructions,
        startDate: formBasicDetails.startDate,
        dueDate: formBasicDetails.dueDate,
        isActive: formBasicDetails.isActive,
        isPublished: false
      };
      
      const formResult = await createForm(formData);
      const formId = formResult.formID; // מזהה הטופס החדש
      

      // 2. יצירת הסעיפים הראשיים ותתי-הסעיפים
      for (let i = 0; i < mainSections.length; i++) {
        const section = mainSections[i];
        
        // יצירת סעיף ראשי
        const sectionData = {
          formId: formId,
          title: section.title,
          description: section.description || "",
          explanation: section.explanation || "",
          maxPoints: section.maxPoints,
          level: 1, // רמה 1 = סעיף ראשי
          orderIndex: i + 1,
          isRequired: section.isRequired || false,
          isVisible: true,
          parentSectionID: section.parentSectionID || null,
          sectionID: 0,
          responsibleEntity: section.responsibleEntity || null,
          responsiblePerson: section.responsiblePerson || null,
          maxOccurrences: section.maxOccurrences || 1
      };

        

        const sectionResult = await createFormSection(sectionData);
        const sectionId = sectionResult.sectionID; // מזהה הסעיף החדש
        

        // 3. יצירת שדות לסעיף הראשי
        if (section.fields && section.fields.length > 0) {
          for (let j = 0; j < section.fields.length; j++) {
            const field = section.fields[j];
            
            const fieldData = {
              formID: 0,
              sectionID: sectionId,  // שים לב לשינוי בשם השדה - אותיות קטנות
              fieldName: field.fieldName || `field_${Date.now()}_${j}`,
              fieldLabel: field.fieldLabel,
              fieldType: field.fieldType,
              isRequired: field.isRequired || false,
              defaultValue: field.defaultValue || "",
              placeholder: field.placeholder || "",
              helpText: field.helpText || "",
              orderIndex: j + 1,
              isVisible: true,
              maxLength: field.maxLength || 250,
              minValue: field.minValue || 0,
              maxValue: field.maxValue || 100,
              scoreCalculationRule: field.scoreCalculationRule || null,
              isActive: true
            };
            
            const fieldResult = await createSectionField(fieldData);
            const fieldId = fieldResult.FieldID; // מזהה השדה החדש
            
            // 4. יצירת אפשרויות לשדה (אם נדרש)
            if (['select', 'radio', 'checkbox'].includes(field.fieldType) && field.options && field.options.length > 0) {
              for (let k = 0; k < field.options.length; k++) {
                const option = field.options[k];
                
                const optionData = {
                  OptionID: 0,
                  FieldID: fieldId,
                  OptionValue: option.optionValue || `option_${k+1}`,
                  OptionLabel: option.optionLabel,
                  ScoreValue: option.scoreValue || 0,
                  OrderIndex: k + 1,
                  IsDefault: option.isDefault || false
                };
                
                await createFieldOption(optionData);
              }
            }
          }
        }
        
        // 5. יצירת תתי-סעיפים
        if (section.subSections && section.subSections.length > 0) {
          for (let j = 0; j < section.subSections.length; j++) {
            const subSection = section.subSections[j];
            
            const subSectionData = {
              formId: formId,
              Title: subSection.title,
              Description: subSection.description || "",
              Explanation: subSection.explanation || "",
              MaxPoints: subSection.maxPoints,
              Level: 2, // רמה 2 = תת-סעיף
              OrderIndex: j + 1,
              IsRequired: subSection.isRequired || false,
              IsVisible: true,
              ParentSectionID: sectionId // שיוך לסעיף ההורה
            };
            
            const subSectionResult = await createFormSection(subSectionData);
            const subSectionId = subSectionResult.SectionID; // מזהה תת-הסעיף החדש
            
            // 6. יצירת שדות לתת-סעיף
            if (subSection.fields && subSection.fields.length > 0) {
              for (let k = 0; k < subSection.fields.length; k++) {
                const field = subSection.fields[k];
                
                const fieldData = {
                  SectionID: subSectionId,
                  FieldName: field.fieldName || `field_${Date.now()}_${k}`,
                  FieldLabel: field.fieldLabel,
                  FieldType: field.fieldType,
                  IsRequired: field.isRequired || false,
                  OrderIndex: k + 1,
                  IsVisible: true,
                  Placeholder: field.placeholder || "",
                  HelpText: field.helpText || ""
                };
                
                const fieldResult = await createSectionField(fieldData);
                const fieldId = fieldResult.FieldID; // מזהה השדה החדש
                
                // 7. יצירת אפשרויות לשדה בתת-סעיף (אם נדרש)
                if (['select', 'radio', 'checkbox'].includes(field.fieldType) && field.options && field.options.length > 0) {
                  for (let l = 0; l < field.options.length; l++) {
                    const option = field.options[l];
                    
                    const optionData = {
                      FieldID: fieldId,
                      OptionValue: option.optionValue || `option_${l+1}`,
                      OptionLabel: option.optionLabel,
                      ScoreValue: option.scoreValue || 0,
                      OrderIndex: l + 1,
                      IsDefault: option.isDefault || false
                    };
                    
                    await createFieldOption(optionData);
                  }
                }
              }
            }
          }
        }
      }
      
      // 8. פרסום הטופס אם נדרש
      if (publish) {
        await publishForm(formId);
      }
      
      setSuccess(publish ? 'הטופס פורסם בהצלחה!' : 'הטופס נשמר כטיוטה בהצלחה!');
      
    } catch (err) {
      console.error("Error saving form:", err);
      setError(err.message || 'שגיאה בשמירת הטופס');
    } finally {
      setLoading(false);
    }
  };

  // שמירת טופס בשלבים - גישה חלופית
  const saveFormStep = async () => {
    try {
      setLoading(true);
      setError('');
      
      // שלב 1: יצירת הטופס הבסיסי
      const formResponse = await createForm({
        formName: formBasicDetails.formName,
        AcademicYear: formBasicDetails.academicYear,
        Semester: formBasicDetails.semester,
        description: formBasicDetails.description,
        instructions: formBasicDetails.instructions,
        StartDate: formBasicDetails.startDate,
        dueDate: formBasicDetails.dueDate,
        IsActive: formBasicDetails.isActive,
        IsPublished: false
      });
      
      // שמירת מזהה הטופס
      const formId = formResponse.FormID;
      setFormId(formId);
      
      // שלב 2: יצירת הסעיפים הראשיים
      for (let i = 0; i < mainSections.length; i++) {
        const section = mainSections[i];
        
        // יצירת סעיף ראשי
        const sectionResponse = await addSection(formId, {
          Title: section.title,
          Description: section.description,
          Explanation: section.explanation,
          MaxPoints: section.maxPoints,
          Level: section.level,
          OrderIndex: section.orderIndex,
          IsRequired: section.isRequired,
          IsVisible: section.isVisible,
          ParentSectionID: null
        });
        
        const sectionId = sectionResponse.SectionID;
        setSectionId(i, sectionId);
        
        // יצירת שדות הסעיף
        for (const field of section.fields) {
          const fieldResponse = await addField(sectionId, {
            FieldName: field.fieldName,
            FieldLabel: field.fieldLabel,
            FieldType: field.fieldType,
            IsRequired: field.isRequired,
            OrderIndex: field.orderIndex,
            IsVisible: field.isVisible,
            Placeholder: field.placeholder,
            HelpText: field.helpText
          });
          
          const fieldId = fieldResponse.FieldID;
          
         // src/pages/NewFormPage.jsx (המשך)

          // יצירת אפשרויות השדה (אם קיימות)
          for (const option of field.options) {
            await addFieldOption(fieldId, {
              OptionValue: option.optionValue,
              OptionLabel: option.optionLabel,
              ScoreValue: option.scoreValue,
              OrderIndex: option.orderIndex,
              IsDefault: option.isDefault
            });
          }
        }
        
        // יצירת תתי-סעיפים
        for (const subSection of section.subSections) {
          const subSectionResponse = await addSection(formId, {
            Title: subSection.title,
            Description: subSection.description,
            Explanation: subSection.explanation,
            MaxPoints: subSection.maxPoints,
            Level: subSection.level,
            OrderIndex: subSection.orderIndex,
            IsRequired: subSection.isRequired,
            IsVisible: subSection.isVisible,
            ParentSectionID: sectionId
          });
          
          const subSectionId = subSectionResponse.SectionID;
          
          // יצירת שדות תת-הסעיף
          for (const field of subSection.fields) {
            const fieldResponse = await addField(subSectionId, {
              FieldName: field.fieldName,
              FieldLabel: field.fieldLabel,
              FieldType: field.fieldType,
              IsRequired: field.isRequired,
              OrderIndex: field.orderIndex,
              IsVisible: field.isVisible,
              Placeholder: field.placeholder,
              HelpText: field.helpText
            });
            
            const fieldId = fieldResponse.FieldID;
            
            // יצירת אפשרויות השדה (אם קיימות)
            for (const option of field.options) {
              await addFieldOption(fieldId, {
                OptionValue: option.optionValue,
                OptionLabel: option.optionLabel,
                ScoreValue: option.scoreValue,
                OrderIndex: option.orderIndex,
                IsDefault: option.isDefault
              });
            }
          }
        }
      }
      
      setSuccess('הטופס נשמר בהצלחה!');
      return true;
      
    } catch (err) {
      console.error("Error saving form by steps:", err);
      setError(err.message || 'שגיאה בשמירת הטופס');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // רנדור תוכן השלב הנוכחי
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
      return (
        <BasicFormDetails
          formData={formBasicDetails}
          updateFormData={updateFormBasicDetails}
        />
      );
      
    case 2:
      return (
        <div className="step-content">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">הגדרת סעיפים וקריטריונים</h5>
            <Button variant="primary" onClick={addMainSection}>
              <i className="bi bi-plus-lg"></i> הוסף סעיף ראשי
            </Button>
          </div>
          
          {mainSections.length === 0 ? (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              לא הוגדרו סעיפים עדיין. התחל ביצירת סעיף ראשי.
            </Alert>
          ) : (
            <div>
              {mainSections.map((section, index) => (
                <FormSection
                  key={index}
                  section={section}
                  sectionIndex={index}
                  updateSection={updateMainSection}
                  addField={(sectionIndex) => addFieldToMainSection(sectionIndex)}
                  departments={departments}
                  users={users}
                  updateField={(sectionIndex, fieldIndex, field, value) => {
                    const updated = [...mainSections];
                    updated[sectionIndex].fields[fieldIndex][field] = value;
                    setMainSections(updated);
                  }}
                  removeField={(sectionIndex, fieldIndex) => {
                    const updated = [...mainSections];
                    updated[sectionIndex].fields.splice(fieldIndex, 1);
                    setMainSections(updated);
                  }}
                  addSubSection={addSubSection}
                  updateSubSection={(sectionIndex, subIndex, field, value) => {
                    const updated = [...mainSections];
                    updated[sectionIndex].subSections[subIndex][field] = value;
                    setMainSections(updated);
                  }}
                  removeSubSection={(sectionIndex, subIndex) => {
                    const updated = [...mainSections];
                    updated[sectionIndex].subSections.splice(subIndex, 1);
                    setMainSections(updated);
                  }}
                  addFieldOption={(sectionIndex, fieldIndex) => {
                    const updated = [...mainSections];
                    if (!updated[sectionIndex].fields[fieldIndex].options) {
                      updated[sectionIndex].fields[fieldIndex].options = [];
                    }
                    updated[sectionIndex].fields[fieldIndex].options.push({
                      optionValue: `option_${Date.now()}`,
                      optionLabel: '',
                      scoreValue: '0',
                      orderIndex: updated[sectionIndex].fields[fieldIndex].options.length + 1,
                      isDefault: false
                    });
                    setMainSections(updated);
                  }}
                  updateFieldOption={(sectionIndex, fieldIndex, optionIndex, field, value) => {
                    const updated = [...mainSections];
                    updated[sectionIndex].fields[fieldIndex].options[optionIndex][field] = value;
                    setMainSections(updated);
                  }}
                  removeFieldOption={(sectionIndex, fieldIndex, optionIndex) => {
                    const updated = [...mainSections];
                    updated[sectionIndex].fields[fieldIndex].options.splice(optionIndex, 1);
                    setMainSections(updated);
                  }}
                  fieldTypeOptions={fieldTypeOptions}
                  removeSection={() => {
                    const updated = [...mainSections];
                    updated.splice(index, 1);
                    setMainSections(updated);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      );
      case 3:
        return (
          <div className="step-content">
            <h5 className="mb-4">סיכום ושמירת הטופס</h5>
            
            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h6 className="mb-0">פרטי הטופס</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p><strong>שם הטופס:</strong> {formBasicDetails.formName}</p>
                    <p><strong>שנת לימודים:</strong> {formBasicDetails.academicYear}</p>
                    <p><strong>סמסטר:</strong> {formBasicDetails.semester || 'לא צוין'}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>תאריך פתיחה:</strong> {new Date(formBasicDetails.startDate).toLocaleDateString('he-IL')}</p>
                    <p><strong>תאריך סיום:</strong> {formBasicDetails.dueDate ? new Date(formBasicDetails.dueDate).toLocaleDateString('he-IL') : 'לא צוין'}</p>
                    <p><strong>סטטוס:</strong> {formBasicDetails.isActive ? 'פעיל' : 'לא פעיל'}</p>
                  </Col>
                </Row>
                {formBasicDetails.description && (
                  <>
                    <hr />
                    <h6>תיאור הטופס:</h6>
                    <p>{formBasicDetails.description}</p>
                  </>
                )}
              </Card.Body>
            </Card>
            
            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h6 className="mb-0">סעיפים וקריטריונים</h6>
              </Card.Header>
              <Card.Body>
                {mainSections.length === 0 ? (
                  <p>לא הוגדרו סעיפים עדיין.</p>
                ) : (
                  <div className="sections-summary">
                    {mainSections.map((section, index) => (
                      <div key={index} className="section-summary mb-3">
                        <h6>{index + 1}. {section.title} ({section.maxPoints} נקודות)</h6>
                        {section.description && <p className="text-muted small">{section.description}</p>}
                        
                        <div className="ms-4 mb-2">
                          <p className="mb-1"><strong>שדות ({section.fields.length}):</strong></p>
                          <ul className="small">
                            {section.fields.map((field, fieldIndex) => (
                              <li key={fieldIndex}>
                                {field.fieldLabel} ({field.fieldType})
                                {field.isRequired && <span className="text-danger"> *</span>}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {section.subSections && section.subSections.length > 0 && (
                          <div className="ms-4">
                            <p className="mb-1"><strong>תתי-סעיפים ({section.subSections.length}):</strong></p>
                            <ul className="small">
                              {section.subSections.map((subSection, subIndex) => (
                                <li key={subIndex}>
                                  {subSection.title} ({subSection.maxPoints} נקודות)
                                  {subSection.isRequired && <span className="text-danger"> *</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
            
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              <strong>שים לב:</strong> בעת פרסום הטופס, הוא יהיה זמין למילוי על ידי המרצים. לפני פרסום, אנא וודא שכל הפרטים והקריטריונים נכונים ומדויקים.
            </Alert>
          </div>
        );
        
      default:
        return null;
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
        <Card.Header className="bg-white border-0 pb-0">
          <h4 className="mb-3 text-center">יצירת טופס חדש</h4>
          <StepProgress 
            currentStep={activeStep} 
            totalSteps={totalSteps} 
            completionPercentage={formProgress}
          />
        </Card.Header>
        
        {error && <Alert variant="danger"><i className="bi bi-exclamation-triangle me-2"></i>{error}</Alert>}
        {success && <Alert variant="success"><i className="bi bi-check-circle me-2"></i>{success}</Alert>}
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <h5>מעבד את הנתונים...</h5>
            <p className="text-muted">אנא המתן בזמן שאנו שומרים את הטופס</p>
          </div>
        ) : (
          <>
            {renderStepContent()}
            
            <div className="d-flex justify-content-between mt-4">
              {activeStep > 1 ? (
                <Button variant="outline-secondary" onClick={prevStep}>
                  <i className="bi bi-arrow-right me-1"></i> חזור
                </Button>
              ) : (
                <div></div>
              )}
              
              {activeStep < totalSteps ? (
                <Button variant="primary" onClick={nextStep}>
                  המשך <i className="bi bi-arrow-left ms-1"></i>
                </Button>
              ) : (
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" onClick={() => handleSave(false)}>
                    שמור כטיוטה
                  </Button>
                  <Button variant="success" onClick={() => handleSave(true)}>
                    פרסם טופס <i className="bi bi-send ms-1"></i>
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </Container>
  );
}

export default NewFormPage;