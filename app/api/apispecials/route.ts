// /api/apispecials.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const placeName = formData.get('placeName')?.toString();
    const location = formData.get('location')?.toString();
    const type = formData.get('type')?.toString();
    const specialName = formData.get('specialName')?.toString();
    const foodorgroc = formData.get('foodorgroc')?.toString();
    const from = formData.get('from')?.toString();
    const till = formData.get('till')?.toString();
    const before = parseFloat(formData.get('before')?.toString() || '0');
    const after = parseFloat(formData.get('after')?.toString() || '0');
    const image = formData.get('image') as File;
    
    // Here we get the poster (userId) passed from the frontend
    const poster = formData.get('poster')?.toString(); // userId of the poster

    // Validate required fields
    if (!placeName || !location || !type || !specialName || !foodorgroc || !from || !till || !image || !poster) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Save the image to the local file system
    const imageName = `${Date.now()}_${image.name}`;
    const imagePath = path.join(process.cwd(), 'public/uploads', imageName);
    const fileData = await image.arrayBuffer();
    fs.writeFileSync(imagePath, Buffer.from(fileData));

    // Check if the place already exists
    let place = await prisma.places.findFirst({
      where: { name: placeName, location }
    });

    // If the place does not exist, create it
    if (!place) {
      place = await prisma.places.create({
        data: { 
          name: placeName!,
          location: location!,
          type: type!,
          imagepath: `/uploads/${imageName}` // Include the imagepath
        }
      });
    }

    // Create the special associated with the place and include the poster (userId)
    const newSpecial = await prisma.special.create({
      data: {
        name: specialName!,
        type: type!,
        foodorgroc: foodorgroc as any,
        from: from!,
        till: till!,
        before,
        after,
        PlaceName: place.name,
        imagepath: `/uploads/${imageName}`,
        placesId: place.id,
        poster: poster, // Add the userId as poster
      }
    });

    return NextResponse.json(newSpecial);
  } catch (error) {
    console.error('Error creating special:', error);
    return NextResponse.json({ error: 'An error occurred while creating the special' }, { status: 500 });
  }
}
