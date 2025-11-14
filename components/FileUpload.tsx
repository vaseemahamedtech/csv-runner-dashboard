'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  onDataProcessed: (data: any) => void;
  onErrors: (errors: any[]) => void;
}

export function FileUpload({ onDataProcessed, onErrors }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      onErrors([{ row: 0, field: 'file', message: 'Please upload a CSV file' }]);
      return;
    }

    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const { processCSVData } = await import('@/lib/utils');
      const { data, errors } = processCSVData(text);
      
      if (errors.length > 0) {
        onErrors(errors);
      } else {
        onDataProcessed(data);
      }
    } catch (error) {
      onErrors([{ row: 0, field: 'file', message: 'Error reading file' }]);
    } finally {
      setIsProcessing(false);
    }
  }, [onDataProcessed, onErrors]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload CSV File</CardTitle>
        <CardDescription>
          Upload a CSV file with columns: date, person, miles run
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-lg">Drop the CSV file here...</p>
          ) : (
            <div>
              <p className="text-lg font-medium mb-2">Drag & drop your CSV file here</p>
              <p className="text-sm text-gray-500 mb-4">or click to browse</p>
              <Button type="button" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Select File'}
              </Button>
            </div>
          )}
        </div>
        
        {acceptedFiles.length > 0 && (
          <Alert className="mt-4">
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Selected file: {acceptedFiles[0].name}
            </AlertDescription>
          </Alert>
        )}

        <Alert className="mt-4 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Download the <a href="/sample-data.csv" download className="underline font-medium">sample CSV file</a> to test the application
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}