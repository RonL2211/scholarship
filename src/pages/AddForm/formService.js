// src/services/formService.js

// URL בסיסי לשרת
const API_BASE_URL = 'https://localhost:7230/api';

// יצירת טופס חדש
export async function createForm(formData) {
  console.log(formData)
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const currentUserId = currentUser?.personId;
    

    // מכיוון שאנחנו יוצרים טופס חדש, מזהה הטופס יהיה 0
    const requestData = {
        formID: 0,
        formName: formData.formName,
        creationDate: new Date().toISOString(),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        description: formData.description || "",
        instructions: formData.instructions || "",
        academicYear:formData.academicYear || "",
        semester: formData.semester ,//&& formData.semester.length > 0 ? formData.semester.charAt(0) : null,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        createdBy: formData.createdBy || currentUserId,
        lastModifiedBy: formData.lastModifiedBy || currentUserId,
        lastModifiedDate: new Date().toISOString(),
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        isPublished: formData.isPublished !== undefined ? formData.isPublished : false
    };
    console.log("שולח לשרת:", requestData);
    
    const response = await fetch(`${API_BASE_URL}/Form`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`שגיאה ביצירת הטופס: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating form:", error);
    throw error;
  }
}
// פרסום טופס קיים
export async function publishForm(formId) {
  try {
    const response = await fetch(`${API_BASE_URL}/Form/${formId}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:currentUserId
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בפרסום הטופס');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error publishing form:', error);
    throw error;
  }
}

// קבלת טופס לפי מזהה
export async function getForm(formId) {
  try {
    const response = await fetch(`${API_BASE_URL}/Form/${formId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בקבלת נתוני הטופס');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting form:', error);
    throw error;
  }
}

// עדכון טופס קיים
export async function updateForm(formId, formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/Form/${formId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בעדכון הטופס');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating form:', error);
    throw error;
  }
}

// יצירת סעיף בטופס
export async function createFormSection(sectionData) {
  try {
    const response = await fetch(`${API_BASE_URL}/FormSection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sectionData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה ביצירת סעיף');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating section:', error);
    throw error;
  }
}

// עדכון סעיף קיים
export async function updateFormSection(sectionId, sectionData) {
  try {
    const response = await fetch(`${API_BASE_URL}/FormSection/${sectionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sectionData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בעדכון סעיף');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating section:', error);
    throw error;
  }
}

// יצירת שדה בסעיף
export async function createSectionField(fieldData) {
  try {
    const response = await fetch(`${API_BASE_URL}/SectionField`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fieldData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה ביצירת שדה');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating field:', error);
    throw error;
  }
}

// עדכון שדה קיים
export async function updateSectionField(fieldId, fieldData) {
  try {
    const response = await fetch(`${API_BASE_URL}/SectionField/${fieldId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fieldData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בעדכון שדה');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating field:', error);
    throw error;
  }
}

// יצירת אפשרות לשדה
export async function createFieldOption(optionData) {
  try {
    const response = await fetch(`${API_BASE_URL}/SectionField/options`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(optionData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה ביצירת אפשרות לשדה');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating field option:', error);
    throw error;
  }
}

// עדכון אפשרות לשדה
export async function updateFieldOption(optionId, optionData) {
  try {
    const response = await fetch(`${API_BASE_URL}/SectionField/options/${optionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(optionData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בעדכון אפשרות לשדה');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating field option:', error);
    throw error;
  }
}

// מחיקת אפשרות משדה
export async function deleteFieldOption(optionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/SectionField/options/${optionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה במחיקת אפשרות משדה');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting field option:', error);
    throw error;
  }
}

// מחיקת סעיף
export async function deleteFormSection(sectionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/FormSection/${sectionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה במחיקת סעיף');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting section:', error);
    throw error;
  }
}

// מחיקת שדה
export async function deleteSectionField(fieldId) {
  try {
    const response = await fetch(`${API_BASE_URL}/SectionField/${fieldId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה במחיקת שדה');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting field:', error);
    throw error;
  }
}

// בדיקת תקינות הטופס
export async function validateForm(formId) {
  try {
    const response = await fetch(`${API_BASE_URL}/Form/validate/${formId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בבדיקת תקינות הטופס');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error validating form:', error);
    throw error;
  }
}


export async function getDepartments() {
  try {
    const response = await fetch(`${API_BASE_URL}/Department`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בקבלת נתוני המחלקות');
    }
    
    const data = await response.json(); 

    console.log("departments result:", data);

    return data;
  } catch (error) {
    console.error('Error getting Departments:', error);
    throw error;
  }
}
export async function getUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/Person`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בקבלת נתוני המשתמשים');
    }
    
    const data = await response.json(); 

    console.log("USERS result:", data);

    return data;
  } catch (error) {
    console.error('Error getting USERS:', error);
    throw error;
  }
}