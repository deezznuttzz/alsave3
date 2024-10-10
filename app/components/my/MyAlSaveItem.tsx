"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import FavFoodButton from './FavFoodButton';
import FavTypeButton from './FavTypeButton';




interface FavTypeButtonProps {
  userId: number;
  ffoodtype: string;
}

interface FavFoodButtonProps {
  userId: number;
  ffoodname: string;
  fplacename: string;
  ffoodtype: string;
}

interface MyAlSaveItemProps {
  name: string;
  type: string;
  place: string;
  placename: string;
  foodorgroc: string;
  before?: number;       
  after: number;
  from: string;
  till: string;
  imagepath?: string;
}

export default function MyAlSaveItem({
  name,
  type,
  place,
  placename,
  before,
  after,
  till,
  from,
  imagepath,
}: MyAlSaveItemProps) {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      const parsedUserId = parseInt(storedUserId, 10);
      if (!isNaN(parsedUserId)) {
        setUserId(parsedUserId);
      }
    }
  }, []);

  return (
    <motion.div
      className="min-w-[200px] bg-purple-200 p-4 rounded-lg shadow-lg"
      whileHover={{ scale: 1.05, rotate: 3 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {imagepath && (
        <img
          src={imagepath}
          alt={name}
          className="w-200 max-h-[150px] object-contain rounded-t-lg" 
        />
      )}
      <div className="p-2">
        <h3 className="text-lg font-semibold">
          {name}
          {userId !== null && (
            <FavFoodButton
              userId={userId}
              ffoodname={name}
              fplacename={place}
              ffoodtype={type}
            />
          )}
        </h3>
        <p className="text-sm text-gray-500">
          {type}
          {userId !== null && (
           <FavTypeButton
           userId={userId}
           ffoodtype={type}
         />
          )}
          
        </p>
        <p className="text-md font-medium">
          {before !== undefined && before !== after && (
            <span className="line-through text-gray-400">
              ${before.toFixed(2)} 
            </span>
          )}
          ${after.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">Expiry: {till}</p>
      </div>
    </motion.div>
  );
}
