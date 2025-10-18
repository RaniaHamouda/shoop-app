"use client";
import React, { useContext, useEffect, useState } from "react";
import GlobalApi from "../_utils/GlobalApi";
import { useSearchParams } from "next/navigation";
import RestaurantCard from "./RestaurantCard";

import { UpdateCartContext } from "./_context/UpdateCartContext";

function RestaurantList() {
  const params = useSearchParams();
  const [categories, setCategories] = useState("All");
  const [restaurant, setRestaurant] = useState([]);
  const { cartItems, setCartItems } = useContext(UpdateCartContext);

  useEffect(() => {
    params && setCategories(params.get("category"));
    params && getRestaurantsList(params.get("category"));
  }, [params]);

  const getRestaurantsList = (category) => {
    GlobalApi.getRestaurants(category).then((resp) => {
      console.log(resp);
      setRestaurant(resp.restaurantS);
    });
  };

  // console.log("restaurants",restaurant);

  return (
    <div className="container mt-5 ">
      <div className="flex items-center gap-5 mb-10">
        <div
          className=" relative inline-block text-[#2e3082] 
      text-2xl font-bold after:content-[''] after:absolute after:left-0 
      after:bottom-[-8px] after:w-2/2 after:h-[3px]
      after:bg-[#2e3082] "
        >
          Popular {categories} Restaurants{" "}
        </div>

        <h2 className=" text-red-500">{restaurant.length} Result</h2>
      </div>
      <div>
        <div className="grid  grid-cols-1  md:grid-cols-3  gap-4  rounded-2xl">
          {restaurant.map((res) => (
            <RestaurantCard key={res.id} res={res} />
          ))}
          {/* <RestaurantCard/> */}
        </div>
      </div>
    </div>
  );
}

export default RestaurantList;
// export default function RestaurantList() {
//   return (
//     <Suspense fallback={<div>Loading restaurants ...</div>}>
//       <CategoryContent />
//     </Suspense>
//   );
// }
