import React from "react";

interface StaticRatingProps {
   rating: number;
   className?: string;
}

const StaticRating: React.FC<StaticRatingProps> = ({ rating, className = "" }) => {
   const normalizedRating = Math.min(Math.max(1, rating), 5);
   return (
      <div className={`flex items-center gap-1 ${className}`}>
         {[1, 2, 3, 4, 5].map((value) => (
            <div
               key={value}
               className={`w-4 h-4 rounded-full flex items-center justify-center border-2 
            ${value <= normalizedRating ? "bg-blue-500 border-blue-600" : "bg-white border-gray-300"}`}
               aria-hidden="true"
            />
         ))}
      </div>
   );
};

export default StaticRating;
