// types.ts
export type Favorite = {
    id: number;
    userId: number;
    user: {
      id: number;
    };
    foodName: string | null;
    placeName: string | null;
    foodType: string | null;
    notified: string;
    relatedSpecials: {
      specialName: string;
      specialType: string;
      beforePrice: number;
      afterPrice: number;
    }[];
    category: string;
  };
  
  export type Special = {
    id: number;
    name: string;
    place: string;
    type: string;
  };
  