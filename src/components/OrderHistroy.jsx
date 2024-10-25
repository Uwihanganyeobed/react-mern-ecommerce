import React from 'react';

const OrderHistory = () => {
  const orders = [
    {
      id: '#10234987',
      paymentDate: '18th March 2021',
      items: [
        {
          imageUrl: 'https://pagedone.io/asset/uploads/1705474774.png',
          title: 'Decoration Flower port',
          author: 'Dust Studios',
          size: 's',
          quantity: 1,
          price: 80,
          status: 'Delivered',
          deliveryExpected: '23rd March 2021',
        },
        {
          imageUrl: 'https://pagedone.io/asset/uploads/1705474672.png',
          title: 'Decoration’s Item',
          author: 'Dust Studios',
          size: 's',
          quantity: 1,
          price: 80,
          status: 'Cancelled',
          deliveryExpected: '23rd March 2021',
        },
      ],
    },
  ];

  return (
    <section className="py-24 relative"id='orderHistory'>
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="font-manrope font-extrabold text-3xl leading-10 text-black mb-9">Order History</h2>

        <div className="flex sm:flex-col lg:flex-row sm:items-center justify-between">
          <ul className="flex max-sm:flex-col sm:items-center gap-x-14 gap-y-3">
            <li className="font-medium text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-600">All Order</li>
            <li className="font-medium text-lg leading-8 cursor-pointer text-black transition-all duration-500 hover:text-indigo-600">Summary</li>
            <li className="font-medium text-lg leading-8 cursor-pointer text-black transition-all duration-500 hover:text-indigo-600">Completed</li>
            <li className="font-medium text-lg leading-8 cursor-pointer text-black transition-all duration-500 hover:text-indigo-600">Cancelled</li>
          </ul>
          <div className="flex max-sm:flex-col items-center justify-end gap-2 max-lg:mt-5">
            <div className="flex rounded-full py-3 px-4 border border-gray-300 relative">
              <input type="text" name="from-dt" id="from-dt" className="font-semibold px-2 text-sm text-gray-900 outline-0 appearance-none flex flex-row-reverse cursor-pointer w-28 placeholder-gray-900" placeholder="11-01-2023" />
            </div>
            <p className="font-medium text-lg leading-8 text-black">To</p>
            <div className="flex rounded-full py-3 px-4 border border-gray-300 relative">
              <input type="text" name="to-dt" id="to-dt" className="font-semibold px-2 text-sm text-gray-900 outline-0 appearance-none flex flex-row-reverse cursor-pointer w-28 placeholder-gray-900" placeholder="11-01-2023" />
            </div>
          </div>
        </div>

        {orders.map((order, orderIndex) => (
          <div key={orderIndex} className="mt-7 border border-gray-300 pt-9">
            <div className="flex max-md:flex-col items-center justify-between px-3 md:px-11">
              <div className="data">
                <p className="font-medium text-lg leading-8 text-black whitespace-nowrap">Order : {order.id}</p>
                <p className="font-medium text-lg leading-8 text-black mt-3 whitespace-nowrap">Order Payment : {order.paymentDate}</p>
              </div>
              <div className="flex items-center gap-3 max-md:mt-5">
                <button className="rounded-full px-7 py-3 bg-white text-gray-900 border border-gray-300 font-semibold text-sm shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-50 hover:border-gray-400">Show Invoice</button>
                <button className="rounded-full px-7 py-3 bg-indigo-600 shadow-sm shadow-transparent text-white font-semibold text-sm transition-all duration-500 hover:shadow-indigo-400 hover:bg-indigo-700"onClick={
                  ()=>{alert("Order Successfully made")}
                }>Buy Now</button>
              </div>
            </div>

            {order.items.map((item, itemIndex) => (
              <React.Fragment key={itemIndex}>
                <svg className="my-9 w-full" xmlns="http://www.w3.org/2000/svg" width="1216" height="2" viewBox="0 0 1216 2" fill="none">
                  <path d="M0 1H1216" stroke="#D1D5DB" />
                </svg>

                <div className="flex max-lg:flex-col items-center gap-8 lg:gap-24 px-3 md:px-11">
                  <div className="grid grid-cols-4 w-full">
                    <div className="col-span-4 sm:col-span-1">
                      <img src={item.imageUrl} alt={item.title} className="max-sm:mx-auto object-cover" />
                    </div>
                    <div className="col-span-4 sm:col-span-3 max-sm:mt-4 sm:pl-8 flex flex-col justify-center max-sm:items-center">
                      <h6 className="font-manrope font-semibold text-2xl leading-9 text-black mb-3 whitespace-nowrap">{item.title}</h6>
                      <p className="font-normal text-lg leading-8 text-gray-500 mb-8 whitespace-nowrap">By: {item.author}</p>
                      <div className="flex items-center max-sm:flex-col gap-x-10 gap-y-3">
                        <span className="font-normal text-lg leading-8 text-gray-500 whitespace-nowrap">Size: {item.size}</span>
                        <span className="font-normal text-lg leading-8 text-gray-500 whitespace-nowrap">Qty: {item.quantity}</span>
                        <p className="font-semibold text-xl leading-8 text-black whitespace-nowrap">Price ${item.price}.00</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-around w-full sm:pl-28 lg:pl-0">
                    <div className="flex flex-col justify-center items-start max-sm:items-center">
                      <p className="font-normal text-lg text-gray-500 leading-8 mb-2 text-left whitespace-nowrap">Status</p>
                      <p className={`font-semibold text-lg leading-8 text-left whitespace-nowrap ${item.status === 'Delivered' ? 'text-green-500' : 'text-red-500'}`}>
                        {item.status}
                      </p>
                    </div>
                    <div className="flex flex-col justify-center items-start max-sm:items-center">
                      <p className="font-normal text-lg text-gray-500 leading-8 mb-2 text-left whitespace-nowrap">Delivery Expected by</p>
                      <p className="font-semibold text-lg leading-8 text-black text-left whitespace-nowrap">{item.deliveryExpected}</p>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrderHistory;
