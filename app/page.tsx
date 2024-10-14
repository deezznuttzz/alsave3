'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import SearchBar from './components/SearchBar';
import SortDropdown from './components/SortDropdown';
import StoreScroller from './components/StoreScroller';
import styles from './ViewSpecials.module.css';  // Import CSS module

type Special = {
  id: number;
  name: string;
  type: string;
  foodorgroc: string;
  from: string;
  till: string;
  before: number;
  after: number;
  imagepath: string;
  place: string;
};

export default function ViewSpecials() {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('priceAfter');

  const filteredGroceries = specials.filter((special) =>
    special.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    special.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
    special.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    axios
      .get('/api/apispecials/view')
      .then((response) => setSpecials(response.data))
      .catch((error) => console.error(error));
  }, []);

  const specialsByPlace = filteredGroceries.reduce((acc: any, special: Special) => {
    const place = special.place;
    if (!acc[place]) {
      acc[place] = [];
    }
    acc[place].push(special);
    return acc;
  }, {});

  Object.keys(specialsByPlace).forEach((place) => {
    specialsByPlace[place].sort((a: Special, b: Special) => {
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      if (sortBy === 'priceAfter') return a.after - b.after;
      if (sortBy === 'place') return a.place.localeCompare(b.place);
      return 0;
    });
  });

  return (
    <div className="p-4">
      <div className={styles.buttonGroup}>
        <Link href="/signup">
          <button className={styles.btn}>Signup</button>
        </Link>
        <Link href="/login">
          <button className={styles.btn}>Signin</button>
        </Link>
        <Link href="/adminlogin">
          <button className={styles.btn}>Business Page</button>
        </Link>
      </div>
  
      <h1 className="text-xl font-bold mb-4">Groceries List</h1>
  
      {/* Search Bar */}
      <SearchBar searchTerm={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
  
      {/* Sort Dropdown */}
      <SortDropdown sortBy={sortBy} onChange={(e) => setSortBy(e.target.value)} />
  
      {Object.keys(specialsByPlace).map((place) => (
        <StoreScroller key={place} place={place} specials={specialsByPlace[place]} />
      ))}
    </div>
  );}