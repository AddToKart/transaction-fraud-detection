'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TransactionForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sender: '',
    receiver: '',
    amount: '',
    description: ''
  });

  const generateRandomTransaction = () => {
    // Generate random hex address (0x + 40 hex chars)
    const generateAddress = () => '0x' + Array.from({length: 40}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    
    // Generate random amount between 0.1 and 10.0
    const generateAmount = () => (Math.random() * 9.9 + 0.1).toFixed(2);
    
    // Sample descriptions
    const descriptions = [
      'Regular payment',
      'Monthly subscription',
      'Service fee',
      'Investment transfer',
      'Urgent payment required',
      'Quick transfer needed',
      'Business transaction',
      'Personal transfer'
    ];
    
    setFormData({
      sender: generateAddress(),
      receiver: generateAddress(),
      amount: generateAmount(),
      description: descriptions[Math.floor(Math.random() * descriptions.length)]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: formData.sender,
          receiver: formData.receiver,
          amount: parseFloat(formData.amount),
          description: formData.description
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || `HTTP error! status: ${response.status}`);
      }

      console.log('Transaction response:', data); // Debug log
      router.push(`/result?id=${data.id}`);
    } catch (err) {
      console.error('Transaction error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={generateRandomTransaction}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Generate Random Transaction
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="sender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sender Address
          </label>
          <input
            type="text"
            name="sender"
            id="sender"
            required
            value={formData.sender}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="0x..."
          />
        </div>

        <div>
          <label htmlFor="receiver" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Receiver Address
          </label>
          <input
            type="text"
            name="receiver"
            id="receiver"
            required
            value={formData.receiver}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="0x..."
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            required
            value={formData.amount}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description (optional)
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Enter transaction description..."
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/50">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Transaction'}
        </button>
      </form>
    </div>
  );
} 