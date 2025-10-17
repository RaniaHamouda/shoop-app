import { UserProfile } from "@clerk/nextjs";
import React from "react";

function User() {
  return (
    <div className="p-30 mt-6 flex justify-center text">
      <div>
        <UserProfile />
      </div>
    </div>
  );
}

export default User;
