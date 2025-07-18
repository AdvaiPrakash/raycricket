import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';

// Setup Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = 'playerdb';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const battingType = formData.get('battingType') as string;
    const bowlingType = formData.get('bowlingType') as string;
    const phone = formData.get('phone') as string;
    const image = formData.get('image') as File;

    if (!name || !battingType || !bowlingType || !phone || !image) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('players');

    // Check for duplicate phone number
    const existingPlayer = await collection.findOne({ phone });
    if (existingPlayer) {
      return NextResponse.json({ success: false, message: 'Phone already registered' }, { status: 400 });
    }

    // Convert image file to base64
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET!,
    });

    const newPlayer = {
      name,
      battingType,
      bowlingType,
      phone,
      imageUrl: uploadResult.secure_url,
    };

    await collection.insertOne(newPlayer);

    return NextResponse.json({ success: true, message: 'Player registered successfully!' });
  } catch (error) {
    console.error('Error in /api/register:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}
