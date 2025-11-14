import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ValidationError } from '@/lib/types';

interface ErrorDisplayProps {
  errors: ValidationError[];
}

export function ErrorDisplay({ errors }: ErrorDisplayProps) {
  if (errors.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>CSV Validation Errors</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1">
          {errors.map((error, index) => (
            <li key={index}>
              Row {error.row}: {error.field} - {error.message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}