import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-red-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
        <p className="text-red-600 text-sm">{message}</p>
      </div>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}