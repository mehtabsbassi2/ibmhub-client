import React, { useEffect, useState } from "react";
import axios from "axios";

const UserBadges = ({ badges=[] }) => {
 
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-4">
      <h2 className="text-lg font-bold text-ibmblue mb-3">🏅 Earned Badges</h2>
      <div className="flex flex-wrap gap-4">
        {badges && badges.length > 0 ? (
          badges.map((b) => (
            <div key={b.id} className="flex flex-col items-center">
              <img src={b.image} alt={b.name} className="w-12 h-12 p-2 object-contain rounded-full border border-ibmblue" />
              <p className="text-sm font-medium mt-1">{b.name}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No badges earned yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserBadges;
