// src/components/ui/StepProgress.jsx
import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const StepProgress = ({ currentStep, totalSteps, completionPercentage }) => {
  // חישוב אחוז ההתקדמות לפי השלב הנוכחי
  const stepPercentage = (currentStep / totalSteps) * 100;
  
  // שימוש באחוז ההתקדמות אם זה הועבר, אחרת חישוב לפי השלב
  const percentage = completionPercentage || stepPercentage;
  
  return (
    <div className="step-progress mb-4">
      <div className="d-flex justify-content-between mb-2">
        <div>
          <strong>שלב {currentStep} מתוך {totalSteps}</strong>
        </div>
        <div>{Math.round(percentage)}% הושלם</div>
      </div>
      <ProgressBar 
        now={percentage} 
        variant={percentage < 50 ? "info" : percentage < 100 ? "primary" : "success"} 
        animated={percentage < 100}
      />
      <div className="d-flex justify-content-between mt-2 text-muted">
        <span>פרטים בסיסיים</span>
        <span>הוספת סעיפים</span>
        <span>סיכום ושמירה</span>
      </div>
    </div>
  );
};

export default StepProgress;