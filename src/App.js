import React from "react";
import Navbar from "./comps/Navbar";
import Headings from "./comps/Headings";
import Featured from "./comps/Featured";
import Categories from "./comps/Categories";
import Footer from "./comps/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* Add other components or content below the navbar */}
        <div className="flex flex-col flex-grow">
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

const Main = () => {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Headings />
      <Featured />
      <Categories />
    </div>
  );
};