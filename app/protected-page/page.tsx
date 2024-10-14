// app/protected-page/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  // Correct import for app router
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import SortDropdown from '../components/SortDropdown';
import MyStoreScroller from '../components/my/MyStoreScroller';

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

export default function ProtectedPage() {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("priceAfter");
  const router = useRouter();  // Use router for redirection

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Get the userId from localStorage
    
    if (userId) {
      axios.get(`/api/user/${userId}`)  // Fetch the user data by userId
        .then(response => {
          const user = response.data;
          
          // Check if the user role is not "User", redirect to the root page
          if (user.role !== 'User') {
            router.push('/');  // Use router.push to navigate
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    } else {
      // If no userId is found, redirect to the root page
      router.push('/');
    }

    // Fetch the specials data from the API
    axios.get('/api/apispecials/view')
      .then(response => setSpecials(response.data))
      .catch(error => console.error(error));
  }, [router]);

  // Filtering, sorting, and grouping specials logic
  const filteredGroceries = specials.filter((special) =>
    special.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    special.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
    special.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const specialsByPlace = filteredGroceries.reduce((acc: any, special: Special) => {
    const place = special.place;
    if (!acc[place]) {
      acc[place] = [];
    }
    acc[place].push(special);
    return acc;
  }, {});

  const subscribeUserToPush = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Get the userId from localStorage
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BBndgWKwLs0XPuy9DIH-Og5YpGrEdHjAIu4eW561L-gmXbqpqLm_gEHoE_pZwWtD0pQFf01CPWBpB0oprDXr7ZM', // Replace with your actual VAPID public key
      });

      // Send the subscription object and userId to your backend
      await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ subscription, userId }), // Send userId with subscription
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('User is subscribed to push notifications:', subscription);
    } catch (error) {
      console.error('Error subscribing user to push notifications:', error);
    }
  };

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      subscribeUserToPush();
    }
  }, []);

  Object.keys(specialsByPlace).forEach((place) => {
    specialsByPlace[place].sort((a: Special, b: Special) => {
      if (sortBy === "type") return a.type.localeCompare(b.type);
      if (sortBy === "priceAfter") return a.after - b.after;
      if (sortBy === "place") return a.place.localeCompare(b.place);
      return 0;
    });
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Groceries List</h1>
      <SearchBar searchTerm={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <SortDropdown sortBy={sortBy} onChange={(e) => setSortBy(e.target.value)} />
      {Object.keys(specialsByPlace).map((place) => (
        <MyStoreScroller key={place} place={place} specials={specialsByPlace[place]} />
      ))}
    </div>
  );
}
