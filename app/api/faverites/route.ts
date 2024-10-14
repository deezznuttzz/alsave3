// app/api/favorites/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import according to your project structure

// Handle GET requests
export async function GET() {
  try {
    const favorites = await prisma.favFood.findMany({
      include: {
        user: true,
        favfoodname: true,
        favplacename: true,
        favtype: true,
      },
    });

    const transformedFavorites = favorites.map((favorite) => {
      let category;

      if (!favorite.ffoodname && !favorite.ffoodtype) {
        category = 'Favorite Place';
      } else if (!favorite.ffoodname && !favorite.fplacename) {
        category = 'Favorite Type';
      } else if (favorite.ffoodname && favorite.ffoodtype && favorite.fplacename) {
        category = 'Favorite Food';
      }

      return {
        id: favorite.id,
        userId: favorite.userId,
        user: {
          id: favorite.user.id,
          name: favorite.user.name,
        },
        foodName: favorite.ffoodname || null,
        placeName: favorite.fplacename || null,
        foodType: favorite.ffoodtype || null,
        notified: favorite.notified,
        relatedSpecials: [
          ...favorite.favfoodname.map((special) => ({
            specialName: special.name,
            specialType: special.type,
            beforePrice: special.before,
            afterPrice: special.after,
          })),
          ...favorite.favplacename.map((special) => ({
            specialName: special.name,
            specialType: special.type,
            beforePrice: special.before,
            afterPrice: special.after,
          })),
          ...favorite.favtype.map((special) => ({
            specialName: special.name,
            specialType: special.type,
            beforePrice: special.before,
            afterPrice: special.after,
          })),
        ],
        category, // New field for category
      };
    });

    return NextResponse.json(transformedFavorites);
  } catch (error) {
    console.error('Error fetching favorite foods:', error);
    return NextResponse.json({ error: 'Error fetching favorite foods' }, { status: 500 });
  }
}

