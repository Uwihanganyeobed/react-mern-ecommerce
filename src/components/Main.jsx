import React from 'react';
import Headings from './Headings';
import Featured from './Featured';
import NewProducts from './NewProducts';
import CategoryProducts from './products/CategoryProducts';

export default function Main() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <Headings />
      <Featured />
      {/* <Categories /> */}
      <CategoryProducts/>
      <NewProducts />
    </div>
  );
} 