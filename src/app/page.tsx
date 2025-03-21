import TransactionForm from "@/components/TransactionForm";
import TestBackendButton from "@/components/TestBackendButton";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left side - Transaction Form */}
          <div className="w-full lg:w-1/2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transaction Fraud Detection
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Submit your transaction details below to check for potential fraud using our Gemini-powered AI detection system.
              </p>
            </div>
            
            <TransactionForm />
            
            <div className="mt-8">
              <TestBackendButton />
            </div>
          </div>
          
          {/* Right side - Features and Info */}
          <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6">How It Works</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Advanced Security</h3>
                  <p className="text-gray-600 dark:text-gray-300">Our system uses state-of-the-art AI to detect fraudulent patterns in transactions.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Real-time Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-300">Get instant feedback on transaction risk levels and detailed explanations.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-medium">Did you know?</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Blockchain fraud detection can prevent up to 98% of potential scams when implemented correctly.
              </p>
            </div>
            
            <div className="mt-8">
              <Link 
                href="/about" 
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                Learn more about our technology
                <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
