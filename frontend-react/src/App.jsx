/**
 * Main App component - Root of the React application.
 * 
 * Sets up routing, authentication context, and error boundaries.
 * All routes are wrapped with appropriate authentication guards.
 */

import './assets/css/style.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Main from './components/Main';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/dashboard/Dashboard';

// Providers & Guards
import AuthProvider from './AuthProvider';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            {/* Public routes */}
            <Route path='/' element={<Main />} />
            <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
            <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
            
            {/* Protected routes - require authentication */}
            <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
