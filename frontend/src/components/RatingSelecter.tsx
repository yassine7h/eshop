import React, { useState } from "react";

interface StarRatingProps {
   onChange?: (rating: number) => void;
}

const RatingSelecter: React.FC<StarRatingProps> = ({ onChange }) => {
   const [rating, setRating] = useState<number>(0);
   const [hover, setHover] = useState<number>(0);

   const handleClick = (value: number) => {
      setRating(value);
      if (onChange) {
         onChange(value);
      }
   };

   return (
      <div className="flex items-center gap-2">
         {[1, 2, 3, 4, 5].map((value) => (
            <button
               key={value}
               className={`w-6 h-6 rounded-full flex items-center justify-center border-2 
            ${(hover || rating) >= value ? "bg-blue-500 border-blue-600" : "bg-white border-gray-300"} 
            hover:border-blue-500 transition-all duration-200`}
               onClick={() => handleClick(value)}
               onMouseEnter={() => setHover(value)}
               onMouseLeave={() => setHover(0)}
               aria-label={`Rate ${value} out of 5`}
            />
         ))}
         <span className="text-gray-600 ml-1 font-semibold">{rating ? `${rating}/5` : "No rating"}</span>
      </div>
   );
};

export default RatingSelecter;
