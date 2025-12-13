import React from "react";

const UserBadges = ({ badges=[] }) => {
 
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-4">
      <h2 className="text-lg font-bold text-ibmblue mb-2">🏅 Earned Badges</h2>
      <p className="text-sm text-gray-600 mb-4">
        Unlock badges by reaching milestones in your learning journey, such as answering questions, receiving upvotes, and completing skill goals.
      </p>
      <div className="flex flex-wrap gap-4">
        {badges && badges.length > 0 ? (
          badges.map((b) => (
            <div key={b.id} className="flex flex-col items-center relative group">
              <img 
                src={b.image} 
                alt={b.name} 
                className="w-12 h-12 p-2 object-contain rounded-full border border-ibmblue cursor-pointer" 
              />
              <p className="text-sm font-medium mt-1">{b.name}</p>
              
              {/* Tooltip */}
              {b.description && (
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-2 px-3 w-48 text-center z-10">
                  {b.description}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
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
