// app/components/FavFoodButton.tsx
'use client';

import { useState } from 'react';

interface FavTypeButtonProps {
  userId: number;
  ffoodtype: string;
}

const FavTypeButton: React.FC<FavTypeButtonProps> = ({ userId, ffoodtype }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddFavType = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/favfood/type', {
        method: 'POST',
        body: JSON.stringify({ userId, ffoodtype }),
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
      onClick={handleAddFavType}
      className="px-4 py-2 bg-blue-500 text-white rounded"
      disabled={loading}
    >
      {loading ? 'Adding...' : 'Add to Favorites'}
    </button>
  );
};

export default FavTypeButton;
