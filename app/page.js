"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// نمنع الـ SSR علشان useSearchParams() تشتغل كويس
const CategoryList = dynamic(() => import("./_components/categoryList"), {
  ssr: false,
});
const RestaurantList = dynamic(() => import("./_components/RestaurantList"), {
  ssr: false,
});

// ✅ أضف السطرين دول تحت imports دايمًا
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
