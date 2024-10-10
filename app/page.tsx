'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import SortDropdown from './components/SortDropdown';
import StoreScroller from './components/StoreScroller';

type Special = {
  id: number;
  name: string;         // Special name
  type: string;
  foodorgroc: string;
  from: string;
  till: string;
  before: number;
  after: number;
  imagepath: string;
  place: string;        // Store or place name (now included from API)
};

export default function ViewSpecials() {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("priceAfter");

  const filteredGroceries = specials.filter((special) =>
    special.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    special.place.toLowerCase().includes(searchTerm.toLowerCase()) ||  // Using place field
    special.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Fetch the specials data from the API
    axios.get('/api/apispecials/view')
      .then(response => setSpecials(response.data))
      .catch(error => console.error(error));
  }, []);

  // Group specials by place (store)
  const specialsByPlace = filteredGroceries.reduce((acc: any, special: Special) => {
    const place = special.place;  // Group by store name
    if (!acc[place]) {
      acc[place] = [];
    }
    acc[place].push(special);  // Push specials under the store
    return acc;
  }, {});

  // Sort specials within each store group
  Object.keys(specialsByPlace).forEach((place) => {
    specialsByPlace[place].sort((a: Special, b: Special) => {
      if (sortBy === "type") return a.type.localeCompare(b.type);
      if (sortBy === "priceAfter") return a.after - b.after; // Assuming 'after' represents 'priceAfter'
      if (sortBy === "place") return a.place.localeCompare(b.place);
      return 0;
    });
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Groceries List</h1>

      {/* Search Bar */}
      <SearchBar searchTerm={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      {/* Sort Dropdown */}
      <SortDropdown sortBy={sortBy} onChange={(e) => setSortBy(e.target.value)} />

      {/* Scrollable Grocery Lists by Store */}
      {Object.keys(specialsByPlace).map((place) => (
        <StoreScroller key={place} place={place} specials={specialsByPlace[place]} /> // Pass place to StoreScroller
      ))}
    </div>
  );
}
