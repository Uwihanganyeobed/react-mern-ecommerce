import React from 'react';
import Headings from './Headings';
import Featured from './Featured';
import Categories from './Categories';
import NewProducts from './NewProducts';

export default function Main() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Headings />
      <Featured />
      <Categories />
      <NewProducts />
    </div>
  );
} 