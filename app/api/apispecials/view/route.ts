import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  // Fetch all specials with related place information
  const specials = await prisma.special.findMany({
    include: { places: true } // Ensure the 'places' relation is fetched
  });
  
  // Transform the data to include place name directly
  const transformedSpecials = specials.map((special) => ({
    ...special,
    place: special.places.name,  // Assign place name from related 'Places'
  }));

  return NextResponse.json(transformedSpecials);
}
