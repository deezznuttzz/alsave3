'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Favorite, Special } from '../types'; // Adjust the import path

export default function ViewFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [specials, setSpecials] = useState<Special[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();  // Use router for redirection

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Get the userId from localStorage

    if (userId) {
      axios.get(`/api/user/${userId}`)
        .then(response => {
          const userRole = response.data.role;  // Assuming the role is returned in the response

          if (userRole !== 'Owner') {
            router.push('/');  // Redirect to the root page if not an 'Owner'
          }
        })
        .catch(error => {
          console.error('Error fetching user role:', error);
          router.push('/');  // Redirect in case of error
        });
    } else {
      router.push('/');  // Redirect if no userId is found
    }
  }, [router]);

  useEffect(() => {
    axios.get('/api/faverites')
      .then(response => setFavorites(response.data))
      .catch(error => console.error('Error fetching favorites:', error));

    axios.get('/api/apispecials/view')
      .then(response => setSpecials(response.data))
      .catch(error => console.error('Error fetching specials:', error));
  }, []);

  const removeDuplicates = (favorites: Favorite[]) => {
    const uniqueFavorites = new Map<string, Favorite>();

    favorites.forEach(favorite => {
      const uniqueKey = `${favorite.foodName}-${favorite.placeName}-${favorite.foodType}`;
      if (!uniqueFavorites.has(uniqueKey)) {
        uniqueFavorites.set(uniqueKey, favorite);
      }
    });

    return Array.from(uniqueFavorites.values());
  };

  const filterFavoritesBySpecials = (favorites: Favorite[], specials: Special[]) => {
    return favorites.filter(favorite => {
      return specials.some(special =>
        favorite.placeName === special.place || 
        favorite.foodName === special.name || 
        favorite.foodType === special.type
      );
    });
  };

  const processedFavorites = removeDuplicates(filterFavoritesBySpecials(favorites, specials));

  const filteredFavorites = processedFavorites.filter(favorite =>
    (favorite.foodName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (favorite.placeName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (favorite.foodType?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const favoritePlaces = filteredFavorites.filter(fav => fav.category === 'Favorite Place');
  const favoriteTypes = filteredFavorites.filter(fav => fav.category === 'Favorite Type');
  const favoriteFoods = filteredFavorites.filter(fav => fav.category === 'Favorite Food');

  const sendMassNotification = async () => {
    try {
      const userNotifications: { [key: string]: string[] } = {};

      filteredFavorites.forEach(favorite => {
        const userId = favorite.user.id;
        const notificationMessage = `${favorite.foodName || favorite.foodType || favorite.placeName}`;

        if (!userNotifications[userId]) {
          userNotifications[userId] = [];
        }

        userNotifications[userId].push(notificationMessage);
      });

      for (const userId in userNotifications) {
        const messages = userNotifications[userId];
        const message = `Check out the new special offers for: ${messages.join(', ')}!`;

        await axios.post('/api/send-notification', {
          message: message,
          userId: userId,
        });
      }
    } catch (error) {
      console.error('Error sending notification', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Favorite Foods</h1>

      <input
        type="text"
        placeholder="Search favorites..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300"
      />

      <button onClick={sendMassNotification} className="mb-4 p-2 bg-blue-500 text-white">
        Send Mass Notification
      </button>

      <div>
        <h2 className="font-bold text-lg mb-2">Favorite Places</h2>
        <ul>
          {favoritePlaces.length > 0 ? (
            favoritePlaces.map((favorite) => (
              <li key={favorite.id} className="mb-4 border-b pb-4">
                <p>Place: {favorite.placeName}</p>
                <p>User ID: {favorite.user.id}</p>
              </li>
            ))
          ) : (
            <p>No favorite places found.</p>
          )}
        </ul>

        <h2 className="font-bold text-lg mb-2">Favorite Types</h2>
        <ul>
          {favoriteTypes.length > 0 ? (
            favoriteTypes.map((favorite) => (
              <li key={favorite.id} className="mb-4 border-b pb-4">
                <p>Type: {favorite.foodType}</p>
                <p>User ID: {favorite.user.id}</p>
              </li>
            ))
          ) : (
            <p>No favorite types found.</p>
          )}
        </ul>

        <h2 className="font-bold text-lg mb-2">Favorite Foods</h2>
        <ul>
          {favoriteFoods.length > 0 ? (
            favoriteFoods.map((favorite) => (
              <li key={favorite.id} className="mb-4 border-b pb-4">
                <p>Food: {favorite.foodName}</p>
                <p>Place: {favorite.placeName}</p>
                <p>User ID: {favorite.user.id}</p>
              </li>
            ))
          ) : (
            <p>No favorite foods found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
