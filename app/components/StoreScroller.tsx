"use client";
import React from 'react';
import AlSaveItem from './AlSaveItem'; // Adjust the path if necessary

interface AlSaveItem {
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

interface StoreScrollerProps {
  place: string;  // This is the place (store name) for the header
  specials: AlSaveItem[];
}

export default function StoreScroller({ place, specials }: StoreScrollerProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-2">{place}</h2> {/* Place name in the header */}
      <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-500">
        {specials.map((special, index) => (
          <div
            key={index}
            className="min-w-[200px] flex-shrink-0" // Prevents flex items from stretching
          >
            <AlSaveItem
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
