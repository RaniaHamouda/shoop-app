"use client";

import React, { Suspense } from "react";
import CategoryList from "./_components/CategoryList";
import RestaurantList from "./_components/RestaurantList";

export default function Home() {
  return (
    <div className="container p-7">
      {/* 👇 نغلف الكومبوننت اللي فيها useSearchParams داخل Suspense */}
      <Suspense
        fallback={
          <p className="text-center text-gray-500">Loading categories...</p>
        }
      >
        <CategoryList />
      </Suspense>

      {/* باقي الصفحة */}
      <RestaurantList />
    </div>
  );
}
