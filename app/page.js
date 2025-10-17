import React, { Suspense } from "react";
import CategoryList from "./_components/categoryList";
import RestaurantList from "./_components/RestaurantList";

export default function Home() {
  return (
    <div className="container p-7">
      <Suspense fallback={<div>Loading categories...</div>}>
        <CategoryList />
      </Suspense>

      <Suspense fallback={<div>Loading restaurants...</div>}>
        <RestaurantList />
      </Suspense>
    </div>
  );
}
