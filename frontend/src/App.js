import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import Login from "./Login"
import Signup from "./Signup"
import Dashboard from "./Dashboard"

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            localStorage.getItem("token") ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

      </Routes>
    </Router>
  )
}

export default App