import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/components/Home";
import Contact from "./pages/components/Contact";
import About from "./pages/components/About";
import Layout from "./pages/components/Layout";
import Academics from "./pages/Academics";
import Hobbies from "./pages/Hobbies";
import Projects from "./pages/components/Projects";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about/">
            <Route path="" element={<About />} />
            <Route path="academics" element={<Academics />} />
            <Route path="hobbies" element={<Hobbies />} />
          </Route>
          <Route path="project" element={<Projects />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
