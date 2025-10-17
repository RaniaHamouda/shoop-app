"use client";
import { useUser } from "@clerk/nextjs";
import { useContext, useEffect, useState } from "react";
import GlobalApi from "../_utils/GlobalApi";
import { UpdateCartContext } from "./_context/UpdateCartContext";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react"; // أيقونة نجمة
import { toast } from "sonner";

function ReviewSection({ restaurant }) {
  const { user } = useUser();
  const { cartItems, setCartItems } = useContext(UpdateCartContext);
  const [reviews, setReviews] = useState([]); // خليتها reviews جمع
  const [formData, setFormData] = useState({
    userName: user?.name || "",
    userEmail: user?.email || "",
    comments: "", // هنا comments صح
    rating: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await GlobalApi.addNewReview({
        ...formData,
        restaurantSlug: restaurant.slug,
      });

      const resp = await GlobalApi.getReviews(restaurant.slug);
      setReviews(resp?.reviewS || []);

      setFormData({
        userName: user?.name || "",
        userEmail: user?.email || "",
        comments: "",
        rating: 1,
      });

      toast.success("Review added successfully");
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Failed to add review");
    }
  };

  useEffect(() => {
    GlobalApi.getReviews(restaurant.slug).then((resp) => {
      setReviews(resp?.reviewS || []);
    });
  }, [restaurant]);

  return (
    <div className="mt-15 w-full container justify-center">
      <h2 className="text-3xl font-bold mb-6">Reviews</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full items-center"
      >
        <input
          type="text"
          placeholder="Name"
          value={formData.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
          required
          className="w-full input input-bordered h-10 bg-amber-100 border-2 rounded-[5px] focus:bg-amber-200"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.userEmail}
          onChange={(e) =>
            setFormData({ ...formData, userEmail: e.target.value })
          }
          required
          className="w-full input input-bordered h-10 bg-amber-100 border-2 rounded-[5px] focus:bg-amber-200"
        />
        <textarea
          placeholder="Comment..."
          value={formData.comments}
          onChange={(e) =>
            setFormData({ ...formData, comments: e.target.value })
          }
          required
          className="w-full input input-bordered h-20 bg-amber-100 border-2 rounded-[5px] focus:bg-amber-200"
        />
        <input
          type="number"
          min="1"
          max="5"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          required
          className="w-full input input-bordered h-10 bg-amber-100 border-2 rounded-[5px] focus:bg-amber-200"
        />
        <Button type="submit" className="text-white  mb-5 w-1/5 ">
          Submit Review
        </Button>
      </form>

      {/* Reviews List */}
      <div className="flex flex-col ">
        {reviews?.map((rev, idx) => (
          <div
            key={idx}
            className="bg-amber-100 border-2 rounded-[5px] p-4 mb-4 items-center "
          >
            <div className="flex items-center mb-2">
              <span className="font-semibold">{rev.userName}</span>
              <div className="flex ml-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 mr-1 ${
                      star <= rev.rating
                        ? "fill-yellow-500 stroke-yellow-600"
                        : "stroke-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="font-light">{rev.comments}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSection;
