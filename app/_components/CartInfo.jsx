import { X } from "lucide-react";
import Image from "next/image";
import React, { useContext } from "react";
import GlobalApi from "../_utils/GlobalApi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UpdateCartContext } from "./_context/UpdateCartContext";
import { toast } from "sonner";

function CartInfo({ cart }) {
  const { setCartItems } = useContext(UpdateCartContext);

  const totalAmount = () => {
    let total = 0;
    cart?.forEach((item) => {
      total = total + item?.price || 0;
    });
    return total;
  };

  const handleRemoveFromCart = async (id) => {
    try {
      await GlobalApi.DeleteFromCart(id);
      // تحديث الـ state بعد الحذف
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      // التوست
      toast("Item removed from cart", {
        position: "top-center",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast(" Failed to remove item");
    }
  };

  return (
    <div className="container p-7 mb-8">
      <div>
        {cart?.map((item) => (
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  className="rounded-full w-10 h-10 mt-3"
                  src={
                    item?.productImg?.stage === "PUBLISHED" ||
                    item?.productImg?.url ||
                    item?.productImg?.id
                  }
                  width={50}
                  height={50}
                  alt={item?.productName}
                />

                <h2 className="font-bold text-sm text-[#333]">
                  {item?.productName}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-red-600">
                  ${item?.price}
                </span>
                <button className="p-1 hover:bg-red-100 rounded-full">
                  <X
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="cursor-pointer text-red-500 h-4 w-4"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
        <Link href="/checkout">
          <Button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-300 transform hover:scale-105 ">
            Checkout {totalAmount()} $
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default CartInfo;
