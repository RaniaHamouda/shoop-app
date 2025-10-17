"use client";

import { UpdateCartContext } from "@/app/_components/_context/UpdateCartContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner"; // أو Toast من مكتبتك

function Checkout() {
  const [loading, setLoading] = useState(false);
  const [delvAmount, setDelvAmount] = useState(5);
  const [taxAmount, setTaxAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [Address, setAddress] = useState("");
  const DEFAULT_EMAIL = "default@yourapp.com";

  const { user } = useUser();
  const { cartItems, setCartItems } = useContext(UpdateCartContext);

  // 🧮 حساب الإجمالي
  const totalAmount = () => {
    let total = 0;
    cartItems?.forEach((item) => {
      total += item?.price || 0;
    });
    const tax = total * 0.05;
    const fullTotal = total + delvAmount + tax;

    setSubtotal(total.toFixed(2));
    setTaxAmount(tax.toFixed(2));
    setTotal(fullTotal.toFixed(2));
  };

  useEffect(() => {
    totalAmount();
  }, [cartItems]);

  // 🧾 إنشاء الطلب
  const createOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);
    try {
      // بيانات الطلب
      const orderData = {
        userName: user?.fullName || Name || "Unknown User",
        email:
          user?.primaryEmailAddress?.emailAddress || Email || DEFAULT_EMAIL,
        orderAmount: parseFloat(total) || 0,
        address: Address || "Unknown Address",
        zipCode: zipCode || "0000",
        phone: Phone || "0000000000",
      };

      // عناصر الطلب (المنتجات)
      const itemsList = cartItems.map((item) => ({
        name: item.productName || item.name || "Unknown Item",
        price: parseFloat(item.price) || 0,
      }));

      // استدعاء API
      await GlobalApi.createNewOrder(orderData, itemsList);

      // تنظيف السلة بعد النجاح
      setCartItems([]);
      toast.success(" Order placed successfully!", {
        position: "top-center",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.", {
        position: "top-center",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
    for (const item of cartItems) {
      await GlobalApi.DeleteFromCart(item.id);
    }
  };

  return (
    <div className="p-7 grid-cols-1 md:grid-cols-2 container items-center mt-25 min-h-screen bg-gray-50">
      <div>
        <h1 className="text-3xl font-bold mb-8 text-yellow-500 border-b-2 shadow-lg p-2">
          Checkout
        </h1>

        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          {/* Billing Details */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex-1">
            <h2 className="text-lg font-bold mb-4 text-blue-500">
              Billing Details
            </h2>
            <form className="grid grid-cols-1 gap-4">
              <Input
                value={Name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
              <Input
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <Input
                value={Phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
              />
              <Input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Zip Code"
              />
              <Input
                value={Address}
                onChange={(e) => setAddress(e.target.value)}
                className="col-span-2"
                placeholder="Address"
              />
            </form>

            <Button
              onClick={createOrder}
              disabled={loading}
              className="mt-4 col-span-2 rounded-md py-2 w-full hover:bg-green-500"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 rounded-2xl shadow-lg flex-1">
            <h2 className="text-lg font-bold mb-4 text-blue-500">
              Order Summary
            </h2>

            {loading && (
              <p className="text-blue-500 font-medium">Loading cart...</p>
            )}

            {!loading && cartItems?.length === 0 && (
              <p className="text-gray-500 text-sm">Your cart is empty.</p>
            )}

            {!loading && cartItems?.length > 0 && (
              <div className="space-y-4 w-full">
                {cartItems?.map((item) => (
                  <div
                    key={item?.id}
                    className="flex items-center justify-between border-b border-gray-200 py-4"
                  >
                    <div className="flex items-center gap-3">
                      {/* {item?.productImg?.id ? (
                        <Image
                          className="object-cover rounded-xl"
                          src={item.productImg.id}
                          width={50}
                          height={50}
                          alt={item?.productName || ""}
                        />
                      ) : (
                        <div className="w-[50px] h-[50px] bg-gray-200 rounded-xl flex items-center justify-center text-xs">
                        
                        </div>
                      )} */}
                      <div>
                        <p className="text-sm font-bold text-yellow-600">
                          {item?.productName}
                        </p>
                        <p className="text-blue-700 text-xs">
                          {item?.productDescription}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-red-600">
                      ${item?.price}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {cartItems?.length > 0 && (
              <div className="mt-4 border-t border-gray-200 p-8 space-y-2 shadow-lg rounded-2xl">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-red-600">
                    ${subtotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="font-semibold text-red-600">
                    ${delvAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-semibold text-red-600">
                    ${taxAmount}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Total:</span>
                  <span className="font-bold text-red-600">${total}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
