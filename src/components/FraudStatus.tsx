'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface FraudStatusProps {
  status: 'Pending' | 'Clear' | 'Suspicious' | 'Fraudulent';
  score?: number;
  transactionId: string;
  details?: {
    sender: string;
    receiver: string;
    amount: number;
    explanation: string;
    risk_factors?: string[];
  };
}

const FraudStatus: React.FC<FraudStatusProps> = ({ status, score, transactionId, details }) => {
  const router = useRouter();
  
  // Debug log to see what's coming in
  console.log("FraudStatus details:", details);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Clear':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Suspicious':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Fraudulent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const formatExplanation = (explanation: string) => {
    if (!explanation) return null;
    
    // Split the explanation into sections
    const sections = explanation.split(/\n(?=\d+\.\s+)/);
    
    return (
      <div className="space-y-6">
        {sections.map((section, index) => {
          const lines = section.split('\n');
          const title = lines[0];
          const content = lines.slice(1);
          
          return (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title}
              </h4>
              <div className="space-y-2">
                {content.map((line, lineIndex) => (
                  <p 
                    key={lineIndex} 
                    className={`text-gray-700 dark:text-gray-300 ${
                      line.includes('⚠') ? 'text-yellow-600 dark:text-yellow-400' :
                      line.includes('✓') ? 'text-green-600 dark:text-green-400' :
                      ''
                    }`}
                  >
                    {line.trim()}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto p-4"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
        variants={item}
      >
        <div className="p-6">
          <motion.h2 
            className="text-2xl font-bold mb-6 text-gray-800 dark:text-white"
            variants={item}
          >
            Transaction Analysis Result
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            variants={item}
          >
            {/* Status Card */}
            <motion.div 
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
              variants={item}
            >
              <h3 className="text-lg font-semibold mb-4">Status Overview</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
                  <p className="font-mono text-sm">{transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Risk Level</p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                    {status}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Risk Score Card */}
            <motion.div 
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
              variants={item}
            >
              <h3 className="text-lg font-semibold mb-4">Risk Score</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${
                        score >= 0.8 ? 'bg-red-500' :
                        score >= 0.5 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${score * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <span className="ml-4 font-mono">{(score * 100).toFixed(1)}%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Transaction Details */}
          <motion.div 
            className="mb-8"
            variants={item}
          >
            <h3 className="text-xl font-semibold mb-4">Transaction Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                  <p className="font-mono text-sm break-all">{details?.sender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                  <p className="font-mono text-sm">{details?.amount} ETH</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                  <p className="font-mono text-sm break-all">{details?.receiver}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Analysis Explanation */}
          <motion.div 
            className="prose dark:prose-invert max-w-none"
            variants={item}
          >
            <h3 className="text-xl font-semibold mb-4">Analysis Explanation</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <ReactMarkdown
                components={{
                  h1: ({...props}) => <h1 className="text-2xl font-bold mb-4" {...props} />,
                  h2: ({...props}) => <h2 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400" {...props} />,
                  h3: ({...props}) => <h3 className="text-lg font-medium mb-2" {...props} />,
                  ul: ({...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                  li: ({...props}) => <li className="mb-1" {...props} />
                }}
              >
                {details?.explanation || ''}
              </ReactMarkdown>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div 
            className="mt-8 flex justify-center"
            variants={item}
          >
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Analyze Another Transaction
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FraudStatus; 