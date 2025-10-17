import CategoryList from "./_components/categoryList";
import React, { Suspense } from "react";
import RestaurantList from "./_components/RestaurantList";

export default function Home() {
  return (
    <div className="container p-7">
      <Suspense
        fallback={
          <p className="text-center text-gray-500">Loading categories...</p>
        }
      >
        <CategoryList />
      </Suspense>
      <RestaurantList />
    </div>
  );
}
