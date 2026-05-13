'use client';

import { Check } from 'lucide-react';

interface WizardStepperProps {
  currentStep: number;
  steps: string[];
}

export default function WizardStepper({ currentStep, steps }: WizardStepperProps) {
  return (
    <div className="stepper">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={label} style={{ display: 'contents' }}>
            <div className="stepper-step" style={{ flex: 'none' }}>
              <div
                className={`stepper-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                {isCompleted ? <Check size={18} /> : stepNum}
              </div>
              <span
                className={`stepper-label ${isActive ? 'active' : ''}`}
                style={{ whiteSpace: 'nowrap' }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`stepper-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
