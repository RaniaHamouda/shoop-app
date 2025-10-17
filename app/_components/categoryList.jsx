"use client";

import React, { useEffect, useState, Suspense } from "react";
import GlobalApi from "../_utils/GlobalApi";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

// مكون فرعي فيه useSearchParams
function CategoryContent() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const params = useSearchParams();

  useEffect(() => {
    if (params?.get("category")) {
      setSelectedCategory(params.get("category"));
    }
  }, [params]);

  useEffect(() => {
    GlobalApi.getCategory().then((resp) => {
      console.log(resp.categories);
      setCategories(resp.categories || []);
    });
  }, []);

  return (
    <div className="container">
      <div className="mt-25 flex overflow-auto">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={15}
          slidesPerView={3}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.id}>
              <Link
                href={"?category=" + cat?.name}
                className={`flex flex-col border-[#cfe411] cursor-pointer justify-center items-center gap-4 border p-4
                 hover:bg-gray-200 transition-all hover:scale-95 hover:border-[#bbebecfd] rounded-xl min-w-30
                ${
                  selectedCategory === cat?.name
                    ? "ml-3 border-[#2e3082] scale-105"
                    : ""
                }`}
              >
                <Image
                  width={70}
                  height={50}
                  src={cat?.icon?.url}
                  alt={cat?.name || "category"}
                />
                <h2 className="text-[#2e3082] font-semibold">{cat?.name}</h2>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

// نلفها بـ Suspense هنا
export default function CategoryList() {
  return (
    <Suspense fallback={<div>Loading categories...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
