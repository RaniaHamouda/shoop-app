"use client";

import React, { useEffect, useState, Suspense } from "react";
import GlobalApi from "../_utils/GlobalApi";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

// 👇 الجزء الداخلي اللي فيه useSearchParams
function CategoryListContent() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const params = useSearchParams();

  useEffect(() => {
    setSelectedCategory(params.get("category"));
  }, [params]);

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = () => {
    GlobalApi.getCategory().then((resp) => {
      console.log(resp.categories);
      setCategories(resp.categories);
    });
  };

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
          {categories &&
            categories.map((cat) => (
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
                  <div>
                    <Image
                      width={70}
                      height={50}
                      src={cat?.icon?.url}
                      alt="img"
                    />
                  </div>
                  <h2 className="text-[#2e3082] font-semibold">{cat?.name}</h2>
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}

// 👇 اللفّة الصحيحة بـ Suspense
export default function CategoryList() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-gray-500">Loading categories...</p>
      }
    >
      <CategoryListContent />
    </Suspense>
  );
}
