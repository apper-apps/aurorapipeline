import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Pipeline from "@/components/pages/Pipeline";
import Contacts from "@/components/pages/Contacts";
import Analytics from "@/components/pages/Analytics";
import Settings from "@/components/pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/pipeline" replace />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          className="mt-16"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;