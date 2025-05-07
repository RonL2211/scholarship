// src/hooks/useFormData.js
import { useState } from 'react';

export default function useFormData() {
  // נתוני הטופס הבסיסיים
  const [formBasicDetails, setFormBasicDetails] = useState({
    formName: '',
    academicYear: '',
    semester: '',
    description: '',
    instructions: '',
    startDate: '',
    dueDate: '',
    isActive: true,
    isPublished: false,
    formId: null, // יתווסף אחרי יצירת הטופס
  });

  // סעיפים ראשיים
  const [mainSections, setMainSections] = useState([]);

  // שגיאות והודעות
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // מצב הטעינה
  const [loading, setLoading] = useState(false);
  
  // מידע על התקדמות הטופס
  const [formProgress, setFormProgress] = useState(0);

  // עדכון פרטים בסיסיים
  const updateFormBasicDetails = (field, value) => {
    setFormBasicDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // עדכון המזהה של הטופס אחרי יצירתו
  const setFormId = (id) => {
    setFormBasicDetails(prev => ({
      ...prev,
      formId: id
    }));
  };

  // הוספת סעיף ראשי
  const addMainSection = () => {
    setMainSections(prev => [
      ...prev,
      {
        sectionId: null, // יתווסף אחרי יצירת הסעיף
        title: '',
        description: '',
        explanation: '',
        maxPoints: '',
        level: 1,
        orderIndex: prev.length + 1,
        isRequired: false,
        isVisible: true,
        fields: [],
        subSections: []
      }
    ]);
  };

  // עדכון סעיף ראשי
  const updateMainSection = (index, field, value) => {
    setMainSections(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };
  
  // עדכון מזהה של סעיף אחרי יצירתו
  const setSectionId = (index, id) => {
    setMainSections(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        sectionId: id
      };
      return updated;
    });
  };

  // הוספת שדה לסעיף ראשי
  const addFieldToMainSection = (sectionIndex) => {
    setMainSections(prev => {
      const updated = [...prev];
      updated[sectionIndex].fields.push({
        fieldId: null, // יתווסף אחרי יצירת השדה
        fieldName: `field_${Date.now()}`,
        fieldLabel: '',
        fieldType: '',
        isRequired: false,
        orderIndex: updated[sectionIndex].fields.length + 1,
        options: [],
        isVisible: true,
        maxLength: null,
        minValue: null,
        maxValue: null,
        placeholder: '',
        helpText: ''
      });
      return updated;
    });
  };

  // הוספת תת-סעיף לסעיף ראשי
  const addSubSection = (parentIndex) => {
    setMainSections(prev => {
      const updated = [...prev];
      updated[parentIndex].subSections.push({
        sectionId: null, // יתווסף אחרי יצירת התת-סעיף
        title: '',
        description: '',
        explanation: '',
        maxPoints: '',
        level: 2,
        orderIndex: updated[parentIndex].subSections.length + 1,
        isRequired: false,
        isVisible: true,
        parentSectionId: updated[parentIndex].sectionId, // קישור לסעיף ההורה
        fields: []
      });
      return updated;
    });
  };

  // חישוב אחוז השלמת הטופס
  const calculateCompletion = () => {
    let percent = 0;
    
    // בדיקת פרטים בסיסיים - 30%
    const basicDetailsFields = ['formName', 'academicYear', 'startDate'];
    const filledBasicFields = basicDetailsFields.filter(field => 
      formBasicDetails[field]?.trim() !== ''
    ).length;
    
    percent += (filledBasicFields / basicDetailsFields.length) * 30;
    
    // בדיקת סעיפים - 50%
    if (mainSections.length > 0) {
      let validSections = 0;
      
      for (const section of mainSections) {
        if (section.title && section.maxPoints) {
          validSections += 0.5;
          
          // בדיקת שדות
          if (section.fields.length > 0) {
            const validFields = section.fields.filter(field => 
              field.fieldLabel && field.fieldType
            ).length;
            
            if (validFields > 0) {
              validSections += 0.5 * (validFields / section.fields.length);
            }
          }
        }
      }
      
      percent += (validSections / mainSections.length) * 50;
    }
    
    // התאמה לטווח 0-100
    return Math.min(Math.round(percent), 100);
  };

  // בדיקת תקינות הטופס
  const validateForm = () => {
    // בדיקת פרטים בסיסיים
    if (!formBasicDetails.formName) return 'שם הטופס הוא שדה חובה';
    if (!formBasicDetails.academicYear) return 'שנת לימודים היא שדה חובה';
    if (!formBasicDetails.startDate) return 'תאריך התחלה הוא שדה חובה';
    
    // בדיקת תאריכים
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(formBasicDetails.startDate);
    
    if (start < today) return 'תאריך התחלה לא יכול להיות בעבר';
    
    if (formBasicDetails.dueDate) {
      const due = new Date(formBasicDetails.dueDate);
      if (due <= start) return 'תאריך סיום חייב להיות מאוחר מתאריך ההתחלה';
    }
    
    // בדיקת סעיפים
    if (mainSections.length === 0) return 'יש להוסיף לפחות סעיף ראשי אחד';
    
    for (let i = 0; i < mainSections.length; i++) {
      const section = mainSections[i];
      
      if (!section.title) return `כותרת חסרה בסעיף ${i + 1}`;
      if (!section.maxPoints) return `ניקוד מקסימלי חסר בסעיף ${i + 1}`;
      
      // בדיקת שדות
      if (section.fields.length === 0) return `יש להוסיף לפחות שדה אחד לסעיף ${i + 1}`;
      
      for (let j = 0; j < section.fields.length; j++) {
        const field = section.fields[j];
        if (!field.fieldLabel) return `תווית שדה חסרה בסעיף ${i + 1}, שדה ${j + 1}`;
        if (!field.fieldType) return `סוג שדה חסר בסעיף ${i + 1}, שדה ${j + 1}`;
      }
    }
    
    return '';
  };

  // החזרת הערכים והפונקציות כדי שנוכל להשתמש בהם בקומפוננטות
  return {
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
  };
}