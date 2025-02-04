import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { VulnerabilityList } from './pages/VulnerabilityList';
import { VulnerabilityDetail } from './pages/VulnerabilityDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      onError: (error) => {
        // Handle error in a serializable way
        console.error('Query Error:', error instanceof Error ? error.message : 'An error occurred');
      }
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<VulnerabilityList />} />
            <Route path="/vulnerability/:id" element={<VulnerabilityDetail />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;