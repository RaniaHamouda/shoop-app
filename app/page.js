import CategoryList from "./_components/categoryList";
import RestaurantList from "./_components/RestaurantList";
import React, { Suspense } from "react";

// ✅ السطر ده هو المفتاح — بيمنع الـ prerender وبيخلي الصفحة ديناميكية
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
