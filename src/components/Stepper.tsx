
import React from 'react';
import { cn } from '@/lib/utils';

export type Step = {
  id: number;
  name: string;
};

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step circle with number */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-200",
                  index + 1 === currentStep
                    ? "bg-primary text-primary-foreground"
                    : index + 1 < currentStep
                    ? "bg-primary/80 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.id}
              </div>
              {/* Step name */}
              <span
                className={cn(
                  "mt-2 text-sm font-medium transition-colors duration-200",
                  index + 1 === currentStep
                    ? "text-primary"
                    : index + 1 < currentStep
                    ? "text-primary/80"
                    : "text-muted-foreground"
                )}
              >
                {step.name}
              </span>
            </div>

            {/* Connector line (except for the last step) */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={cn(
                    "h-1 transition-colors duration-200",
                    currentStep > index + 1
                      ? "bg-primary"
                      : "bg-muted"
                  )}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
