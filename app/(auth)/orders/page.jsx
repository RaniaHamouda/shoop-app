"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import GlobalApi from "@/app/_utils/GlobalApi";

function Order() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ تنسيق التاريخ
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ جلب الطلبات من Hygraph
  const getMyOrders = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    setLoading(true);

    try {
      const email = user.primaryEmailAddress.emailAddress;
      console.log(" Fetching orders for:", email);

      const resp = await GlobalApi.myOrders(email);
      console.log(" Orders Response:", resp);

      if (resp?.orders?.length > 0) {
        setOrders(resp.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ تشغيل الدالة بعد تحميل المستخدم
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getMyOrders();
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🧾 My Orders</h1>

      {/* حالة التحميل */}
      {loading && <p className="text-blue-500">Loading orders...</p>}

      {/* في حالة مفيش طلبات */}
      {!loading && orders.length === 0 && (
        <p className="text-gray-500">No orders found.</p>
      )}

      {/* عرض الطلبات */}
      {!loading && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-xl p-5 shadow-md bg-white hover:shadow-lg transition-all"
            >
              {/* الهيدر */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Order #{order.id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold text-lg">
                    ${order.orderAmount}
                  </p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Delivered
                  </span>
                </div>
              </div>

              {/* تفاصيل الطلب */}
              <div className="border-t pt-4 mt-2">
                <h4 className="font-semibold mb-3 text-gray-800">
                  Order Items:
                </h4>

                {/* ✅ هنا أهم حاجة: نستخدم order.orderitems */}
                <div className="space-y-2">
                  {order.orderitems?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>{item.name}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* بيانات الشحن */}
              <div className="border-t pt-3 mt-4 text-sm text-gray-600">
                <p>
                  <strong>Delivered To:</strong> {order.userName}
                </p>
                <p>
                  <strong>Address:</strong> {order.address}
                </p>
                <p>
                  <strong>Phone:</strong> {order.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Order;
