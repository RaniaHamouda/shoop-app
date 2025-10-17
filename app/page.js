"use client";

import React, { Suspense } from "react";
import CategoryList from "./_components/categoryList";
import RestaurantList from "./_components/RestaurantList";

// ✅ مهم جدًا عشان يمنع الـ prerender اللي عامل المشكلة
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="container p-7">
      <Suspense fallback={<p>Loading...</p>}>
        <CategoryList />
      </Suspense>
      <RestaurantList />
    </div>
  );
}
