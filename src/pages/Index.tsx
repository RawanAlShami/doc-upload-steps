
import React from 'react';
import DocumentUpload from '@/components/DocumentUpload';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-soft-blue/10 flex flex-col items-center justify-center p-4">
      <div className="w-full">
        <DocumentUpload />
      </div>
    </div>
  );
};

export default Index;
