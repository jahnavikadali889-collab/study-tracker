import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ఇక్కడ './components/Login' తీసేసి డైరెక్ట్ గా కరెక్ట్ పాత్స్ ఇచ్చాను
import Login from './Login'; 
import Signup from './Signup';
import Dashboard from './Dashboard'; 

function App() {
  // బ్రౌజర్ లో టోకెన్ ఉందో లేదో చెక్ చేయడానికి
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* యాప్ ఓపెన్ అవ్వగానే డీఫాల్ట్ గా లాగిన్ పేజీ ఓపెన్ అవుతుంది */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* లాగిన్ మరియు సైన్అప్ రూట్స్ */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* డాష్‌బోర్డ్ రూట్ */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;