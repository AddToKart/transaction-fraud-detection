'use client';

import { useState } from 'react';

export default function TestBackendButton() {
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testBackendConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/health');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setStatus(JSON.stringify(data));
    } catch (err) {
      setError(`Connection failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-2">Backend Connection Test</h3>
      
      <button
        onClick={testBackendConnection}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Backend Connection'}
      </button>
      
      {status && (
        <div className="mt-3 p-3 bg-green-100 text-green-800 rounded">
          <p className="font-medium">Connection successful!</p>
          <p className="text-sm">Response: {status}</p>
        </div>
      )}
      
      {error && (
        <div className="mt-3 p-3 bg-red-100 text-red-800 rounded">
          <p className="font-medium">Connection failed</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
} 