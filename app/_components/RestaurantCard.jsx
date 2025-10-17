"use client";

import Image from "next/image";
import Link from "next/link";
// import UpdateCartContext from "./_context/UpdateCartConetext";
// import { useContext } from "react";

function RestaurantCard({ res }) {
  // const [cartItems, setCartItems] = useContext(UpdateCartContext);
  return (
    <div className=" container  mt-5">
      <Link
        href={`/restaurants/${res?.slug}`}
        className=" hover:scale-106 transition-all cursor-pointer"
      >
        <div className=" hover:scale-106 transition-all cursor-pointer">
          <Image
            className=" h-[200px] w-[500px] rounded-2xl  "
            src={res?.banner.url}
            alt={res?.banner.url}
            width={200}
            height={200}
          />

          <div className="text-xl font-bold text-[#2e3082] mt-2 ">
            {res?.name}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/star.png" alt="star" width={20} height={20} />
              <label className="text-gray-400">4.5</label>
              <h2 className="text-gray-400">{res?.resTayp[0]}</h2>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default RestaurantCard;
