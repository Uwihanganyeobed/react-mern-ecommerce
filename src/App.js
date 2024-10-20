import React from 'react';
import Navbar from './comps/Navbar';
import Example from './comps/Example';
import Featured from './comps/Featured';
import Categories from './comps/Categories';
import Footer from './comps/Footer';
export default function App() {
  return (
    <div className='flex flex-col'>
      <Navbar />
      {/* Add other components or content below the navbar */}
      <div className="flex flex-col">
        <Example />
        <Featured />
        <Categories />
        <Footer />
      </div>
    </div>
  );
}
