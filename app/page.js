import React, { Suspense } from "react";
import CategoryList from "./_components/categoryList";
import RestaurantList from "./_components/RestaurantList";

export default function Home() {
  return (
    <div className="container p-7">
      {/* نحط CategoryList داخل Suspense لتجنب error */}
      <Suspense
        fallback={<p className="text-center mt-10">Loading categories...</p>}
      >
        <CategoryList />
      </Suspense>

      <Suspense
        fallback={<p className="text-center mt-10">Loading restaurants...</p>}
      >
        <RestaurantList />
      </Suspense>
    </div>
  );
}
