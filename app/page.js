"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const CategoryList = dynamic(() => import("./_components/categoryList"), {
  ssr: false,
});
const RestaurantList = dynamic(() => import("./_components/RestaurantList"), {
  ssr: false,
});

// 🔥 دا بيمنع Vercel من محاولة عمل prerender للصفحة
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function Home() {
  return (
    <div className="container p-7">
      <Suspense fallback={<p>Loading categories...</p>}>
        <CategoryList />
      </Suspense>

      <Suspense fallback={<p>Loading restaurants...</p>}>
        <RestaurantList />
      </Suspense>
    </div>
  );
}
