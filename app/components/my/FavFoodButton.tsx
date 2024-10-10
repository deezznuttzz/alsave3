// app/components/FavFoodButton.tsx
'use client';

import { useState } from 'react';

interface FavFoodButtonProps {
  userId: number;
  ffoodname: string;
  fplacename: string;
  ffoodtype: string;
}

const FavFoodButton: React.FC<FavFoodButtonProps> = ({ userId, ffoodname, fplacename, ffoodtype }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddFavFood = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/favfood/add', {
        method: 'POST',
        body: JSON.stringify({ userId, ffoodname, fplacename, ffoodtype }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to add favorite food');
      }

      console.log('Favorite food added successfully');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddFavFood}
      className="px-4 py-2 bg-blue-500 text-white rounded"
      disabled={loading}
    >
      {loading ? 'Adding...' : 'Add to Favorites'}
    </button>
  );
};

export default FavFoodButton;
