"use client";

import React, { useEffect, useState } from 'react';
import MyAlSaveItem from './MyAlSaveItem'; // Adjust the path if necessary
import FavPlaceButton from './FavPlaceButton';

interface FavPlaceButtonProps {
  userId: number;
  fplacename: string;
}

interface FavFoodButtonProps {
  userId: number;
  ffoodname: string;
  fplacename: string;
  ffoodtype: string;
}

interface MyAlSaveItem {
  name: string;       // Special name
  type: string;
  place: string;      // Store name
  foodorgroc: string;
  from: string;
  till: string;
  before: number;
  after: number;
  imagepath: string;
}

interface MyStoreScrollerProps {
  place: string;  // This is the place (store name) for the header
  specials: MyAlSaveItem[];
}

export default function MyStoreScroller({ place, specials }: MyStoreScrollerProps) {
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
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-2">
        {place}
        {userId !== null && (
          <FavPlaceButton
            userId={userId}
            fplacename={place} // Assuming you want to pass the place name here
          />
        )}
      </h2> {/* Place name in the header */}
      <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-500">
        {specials.map((special, index) => (
          <div
            key={index}
            className="min-w-[200px] flex-shrink-0" // Prevents flex items from stretching
          >
            <MyAlSaveItem
              name={special.name} // Special name in the card
              type={special.type}
              placename={special.name}
              foodorgroc={special.foodorgroc}
              from={special.from}
              till={special.till}
              place={special.place} // Store name passed but not displayed on the card
              before={special.before}
              after={special.after}
              imagepath={special.imagepath}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
