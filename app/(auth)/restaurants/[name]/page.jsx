"use client";

import ReviewSection from "@/app/_components/ReviewSection";
import GlobalApi from "@/app/_utils/GlobalApi";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AddToCart } from "@/app/_utils/GlobalApi";
import { UpdateCartContext } from "@/app/_components/_context/UpdateCartContext";

function RestaurantDetails() {
  const { name } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cartItems, setCartItems } = useContext(UpdateCartContext);

  useEffect(() => {
    if (!name) return;
    GlobalApi.restaurantDetails(name)
      .then((resp) => {
        // console.log("API Response (restaurant):", resp.restaurant);
        setRestaurant(resp.restaurant);
        setCartItems(!cartItems);
        setLoading(false);
      })
      .catch((err) => {
        // console.error("API error:", err);
        setLoading(false);
      });
  }, [name]);

  // Normalize menu into an array no matter if it's array, single object, or object-of-categories
  const menuArray = useMemo(() => {
    const m = restaurant?.menu;
    if (!m) return [];

    if (Array.isArray(m)) return m; // already an array of categories

    // If it's a single category object with 'menuitem' (like in your screenshot), wrap it
    if (m && typeof m === "object" && Array.isArray(m.menuitem)) {
      return [m];
    }

    // If it's an object where categories are values: convert to array
    if (m && typeof m === "object") {
      return Object.values(m).filter(Boolean);
    }

    return [];
  }, [restaurant?.menu]);

  // Debug: لو حابة تشوفي الشكل اللي بيتخزن فعلاً (بعد التوحيد إلى array) عطيه للكونسول
  useEffect(() => {
    // console.log("normalized menuArray:", menuArray);
  }, [menuArray]);

  if (loading) {
    return (
      <div className="container flex justify-center items-center h-[70vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-y-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">
            Loading restaurant details...
          </p>
        </div>
      </div>
    );
  }

  if (!restaurant)
    return (
      <p className="text-center mt-10 text-red-500">Restaurant not found</p>
    );
  // ************************************ Addto Cart ***********************************
  const handleAddToCart = async (product) => {
    try {
      // const newItem = await GlobalApi.getUserCart(product);
      const res = await GlobalApi.AddToCart({
        productName: product.name,
        price: product.price,
        productDescription: product.description || "No description",
        email: product.userEmail || "default@yourapp.com",
        productImg: product.productimage.id,
      });
      if (res?.createShoppingCart) {
        setCartItems((prev) => [...prev, res.createShoppingCart]);
      }

      toast(" Product added to cart", {
        position: "top-center",
        duration: 3000,
        icon: "🛒",
        description: product.name,
      });
      // console.log("Add to cart response:", res);

      // Update the cart count in the UI
    } catch (err) {
      const errorMessage = err.response?.errors || err.message;
      toast(" Error adding item to cart", {
        description: errorMessage,
      });
    }
  };

  // ***************************************End Addto Car******************************
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 container mt-30">
      {/* Banner */}
      {restaurant?.banner?.url && (
        <div className="relative w-full md:h-130 mb-6 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={restaurant.banner.url}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35 flex items-end p-4 rounded-lg">
            {restaurant?.name && (
              <h2 className="text-amber-100 text-3xl font-bold">
                {restaurant.name}
              </h2>
            )}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div className="space-y-2">
          <p className="text-gray-700 font-medium">
            <span className="font-bold">Address:</span> {restaurant.address}
          </p>
          <p className="text-gray-700 font-medium">
            <span className="font-bold">Restaurant:</span>{" "}
            {restaurant.resTayp?.map((type) => (
              <span key={type} className="mr-2 text-blue-800">
                {type}
              </span>
            ))}
          </p>
          <p className="text-gray-700 font-medium">
            <span className="font-bold">Working Hours:</span>{" "}
            {restaurant.workingHours}
          </p>
        </div>
      </div>

      {/* Menu */}
      <h2 className="text-2xl text-red-900 md:text-3xl font-bold mb-4 border-b pb-2">
        Menu
      </h2>

      {/* optional: show normalized menu on page for visual debugging — بعد ما تتأكدي امحيه */}
      {/* <pre className="whitespace-pre-wrap">{JSON.stringify(menuArray, null, 2)}</pre> */}

      {menuArray.map((mnueCategory) => (
        <div key={mnueCategory?.id ?? Math.random()} className="mb-6">
          {/* ملاحظة: الاسم من الصورة عندك 'catego' مش 'category' */}
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-blue-950">
            {mnueCategory?.catego}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-blue-950 gap-4">
            {(mnueCategory?.menuitem || []).map((item) => (
              <div
                key={item?.id}
                className="bg-yellow-200 rounded-lg shadow-lg p-4 flex text-red-500 flex-col items-center "
              >
                {item?.productimage?.url && (
                  <div className="relative w-full h-40 mb-4">
                    <Image
                      src={item.productimage.url}
                      alt={item?.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-2">{item?.name}</h3>
                {item?.description && (
                  <p className="text-gray-600 mb-2">{item.description}</p>
                )}
                {item?.price != null && (
                  <p className="text-blue-900 font-semibold mb-2">
                    $ {item.price.toFixed(2)}
                  </p>
                )}
                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-yellow-800 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded mt-auto flex items-center gap-2"
                >
                  {/* <div className="relative p-4 flex flex-col justify-between"> */}
                  <Plus
                    className="w-4 h-4"
                    strokeWidth={2}
                    stroke="currentColor"
                  />
                  Add to Cart
                </button>
                {/* </div> */}
              </div>
            ))}
          </div>
        </div>
      ))}
      <ReviewSection restaurant={restaurant} />
    </div>
  );
}

export default RestaurantDetails;
