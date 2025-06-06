import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const orderStatusFlow = ['Preparing', 'Packed', 'Dispatched', 'Delivered'];

const StoreOperatorDashboard = () => {
  const { user } = useUser();
  const operatorId = user?._id;

  const [pendingOrders, setPendingOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!operatorId) {
      console.error('Operator ID is missing!');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/store/operator/${operatorId}/orders`,
          { withCredentials: true }
        );

        const pending = [];
        const history = [];

        data.orders.forEach(order => {
          const formattedOrder = {
            id: order._id,
            customerName: order.user?.fullname || 'Unknown',
            items: order.orderItems.map(item => ({
              name: item.product?.name || 'Unknown Product',
              quantity: item.quantity,
            })),
            totalCost: order.totalPrice,
            address: `${order.shippingInfo.address}, ${order.shippingInfo.city}`,
            currentStatus: order.orderStatus,
          };

          if (order.orderStatus === 'Delivered') {
            history.push(formattedOrder);
          } else {
            pending.push(formattedOrder);
          }
        });

        setPendingOrders(pending);
        setOrderHistory(history);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch store orders:', error.response?.data || error.message || error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [operatorId]);

  const updateOrderStatus = (orderId) => {
    setPendingOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          const currentIndex = orderStatusFlow.indexOf(order.currentStatus);
          const nextStatus = orderStatusFlow[currentIndex + 1] || order.currentStatus;
          return { ...order, currentStatus: nextStatus };
        }
        return order;
      })
    );
  };

  const handleButtonClick = (order, status) => {
    if (status === 'Delivered') {
      setPendingOrders(prev => prev.filter(o => o.id !== order.id));
      setOrderHistory(prev => [...prev, { ...order, currentStatus: 'Delivered' }]);

      axios.patch(`http://localhost:4000/api/v1/order/${order.id}/status`, {
        status: 'Delivered'
      })
      .then(response => {
        console.log('Order status updated:', response.data);
      })
      .catch(err => {
        console.error('Failed to update status on backend:', err.response?.data || err.message);
      });
    }
  };

  if (loading) return <p className="text-center text-lg text-gray-600">Loading orders...</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Pending Orders</h2>
      <div className="flex flex-wrap justify-center gap-5">
        {pendingOrders.length > 0 ? (
          pendingOrders.map(order => (
            <div
              key={order.id}
              className="w-72 bg-white border border-gray-300 rounded-lg p-5 shadow-md"
            >
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Ordered By: {order.customerName}
              </h3>
              <ul className="list-disc pl-5 mb-2 text-sm text-gray-600">
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.name} - {item.quantity}</li>
                ))}
              </ul>
              <p className="text-sm mb-1"><strong>Total Cost:</strong> ₹{order.totalCost}</p>
              <p className="text-sm mb-2"><strong>Address:</strong> {order.address}</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {orderStatusFlow.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleButtonClick(order, status)}
                    className="flex-1 bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 text-sm"
                  >
                    {status}
                  </button>
                ))}
              </div>

              <p className="mt-3 text-green-600 font-semibold text-sm">
                <strong>Current Status:</strong> {order.currentStatus}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No pending orders!</p>
        )}
      </div>

      <h2 className="text-2xl font-semibold text-center text-gray-800 mt-12 mb-6">Order History</h2>
      <div className="flex flex-wrap justify-center gap-5">
        {orderHistory.length > 0 ? (
          orderHistory.map(order => (
            <div
              key={order.id}
              className="w-72 bg-white border border-gray-300 rounded-lg p-5 shadow-md"
            >
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Ordered By: {order.customerName}
              </h3>
              <ul className="list-disc pl-5 mb-2 text-sm text-gray-600">
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.name} - {item.quantity}</li>
                ))}
              </ul>
              <p className="text-sm mb-1"><strong>Total Cost:</strong> ₹{order.totalCost}</p>
              <p className="text-sm mb-2"><strong>Address:</strong> {order.address}</p>
              <p className="text-green-600 font-semibold text-sm">
                <strong>Final Status:</strong> {order.currentStatus}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No orders delivered yet!</p>
        )}
      </div>
    </div>
  );
};

export default StoreOperatorDashboard;
