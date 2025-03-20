'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FraudStatus from '../../components/FraudStatus';
import LoadingSpinner from '../../components/LoadingSpinner';

interface TransactionResult {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  status: 'Clear' | 'Suspicious' | 'Fraudulent';
  score: number;
  explanation: string;
  risk_factors?: string[];
  timestamp: string;
}

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get('id');
  
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 10;
  const POLLING_INTERVAL = 1000; // 1 second
  
  useEffect(() => {
    if (!transactionId) {
      setError('No transaction ID provided');
      setLoading(false);
      return;
    }

    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchResult = async () => {
      if (!mounted) return false;

      try {
        const response = await fetch(`http://localhost:8000/api/status/${transactionId}`);
        const data = await response.json();

        // If database is not available, keep polling
        if (response.status === 503) {
          console.log("Database not available yet, retrying...");
          return false;
        }

        // If transaction is not found, keep polling
        if (response.status === 404) {
          console.log("Transaction not found yet, retrying...");
          return false;
        }

        if (!response.ok) {
          throw new Error(data.error || `Server error: ${response.status}`);
        }

        setResult(data);
        setLoading(false);
        return true;

      } catch (err) {
        console.error('Failed to fetch transaction result:', err);
        
        if (retryCount >= MAX_RETRIES) {
          setError('Failed to fetch transaction result after multiple attempts. Please try again.');
          setLoading(false);
          return true;
        }

        setRetryCount(prev => prev + 1);
        return false;
      }
    };

    const poll = async () => {
      const shouldStop = await fetchResult();
      
      if (!shouldStop && mounted) {
        timeoutId = setTimeout(poll, POLLING_INTERVAL);
      }
    };

    poll();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [transactionId, retryCount]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <LoadingSpinner message="Retrieving transaction analysis..." />
        {retryCount > 0 && (
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Attempt {retryCount} of {MAX_RETRIES}...
          </p>
        )}
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {error || 'Failed to fetch transaction result. Please try again.'}
          </p>
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <FraudStatus 
      status={result.status} 
      score={result.score} 
      transactionId={result.id}
      details={{
        sender: result.sender,
        receiver: result.receiver,
        amount: result.amount,
        explanation: result.explanation,
        risk_factors: result.risk_factors || []
      }}
    />
  );
} 