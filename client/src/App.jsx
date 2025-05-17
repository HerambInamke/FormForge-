import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { FormProvider } from './context/FormContext';
import Login from './components/Login';
import FormPage1 from './components/FormPage1';
import FormPage2 from './components/FormPage2';
import FormPage3 from './components/FormPage3';
import Summary from './components/Summary';
import Dashboard from './components/Dashboard';
import './App.css'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

// Main App Component
function App() {
  const { token } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/form/page1"
              element={
                <ProtectedRoute>
                  <FormPage1 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/form/page2"
              element={
                <ProtectedRoute>
                  <FormPage2 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/form/page3"
              element={
                <ProtectedRoute>
                  <FormPage3 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/form/summary"
              element={
                <ProtectedRoute>
                  <Summary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/" 
              element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
