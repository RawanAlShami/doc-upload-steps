
import React, { useState } from 'react';
import Stepper, { Step } from './Stepper';
import FileUpload from './FileUpload';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const steps: Step[] = [
  { id: 1, name: 'Upload' },
  { id: 2, name: 'Review' },
  { id: 3, name: 'Submit' },
];

const DocumentUpload: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
  };

  const handleNext = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a file to continue.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Step completed",
        description: `Moving to ${steps[currentStep].name} step.`,
      });
    }
  };

  const handleCancel = () => {
    if (file) {
      if (confirm("Are you sure you want to cancel? Your uploaded document will be discarded.")) {
        setFile(null);
        setCurrentStep(1);
        toast({
          title: "Upload canceled",
          description: "Your upload has been canceled.",
        });
      }
    } else {
      toast({
        title: "Upload canceled",
        description: "Your upload has been canceled.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h1 className="text-2xl font-bold text-center mb-6">Upload your document</h1>

        <FileUpload onFileChange={handleFileChange} />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleNext} disabled={!file}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default DocumentUpload;
