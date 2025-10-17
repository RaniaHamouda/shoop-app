"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UpdateCartContext } from "./_context/UpdateCartContext";
import GlobalApi from "../_utils/GlobalApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CartInfo from "./CartInfo";
import Link from "next/link";

function Header() {
  const { user } = useUser();

  const { cartItems, setCartItems } = useContext(UpdateCartContext);

  // الإيميل الثابت اللي بتسجل بيه كل الداتا في Hygraph
  const DEFAULT_EMAIL = "default@yourapp.com";

  const getUserCart = () => {
    // بدل ما نستنى الإيميل من Clerk، نستخدم الإيميل الثابت
    GlobalApi.getUserCart(DEFAULT_EMAIL)
      .then((resp) => {
        console.log("API response", resp);
        setCartItems(resp?.shoppingCarts || []);
      })
      .catch((err) => {
        console.log("API error", err);
      });
  };

  useEffect(() => {
    // بمجرد ما الصفحة تفتح أو يحصل Login
    getUserCart();
  }, [user]); // يتحدث لما اليوزر يتغير بس

  return (
    <div className="container fixed  left-0  z-50  bg-white shadow-md">
      <div
        className="flex items-center justify-between p-2.5 bg-[#f0ee91]"
        style={{ boxShadow: "0 3px 3px 0 " }}
      >
        <Image src="/logo.png" alt="Logo" width={100} height={100} />
        <div className="flex p-4 border bg-gray-100 rounded-2xl">
          <input className="outline-none" type="text" placeholder="Search..." />
          <Search />
        </div>
        <div className="flex ">
          {!user && (
            <div className="flex gap-2 ml-5">
              <SignInButton mode="modal">
                <Button>Signin</Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button>Signup</Button>
              </SignUpButton>
            </div>
          )}
        </div>
        <Popover>
          <PopoverTrigger>
            <div className="relative cursor-pointer ">
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
                {cartItems?.length || 0}
              </span>
            </div>
            <ShoppingCart className="w-6 h-6  cursor-pointer text-blue-950 " />
          </PopoverTrigger>
          <PopoverContent>
            {" "}
            <CartInfo cart={cartItems} />
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <UserButton />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/user">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <Link href="/orders">
              <DropdownMenuItem>MyOrders</DropdownMenuItem>
            </Link>
            <Link href="/">
              <DropdownMenuItem>
                <SignOutButton />
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default Header;
