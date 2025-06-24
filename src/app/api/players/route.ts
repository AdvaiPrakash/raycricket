import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const dbName = 'playerdb';

export async function GET() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('players');
    const players = await collection.find().toArray();

    return NextResponse.json({ players });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Failed to load players' }, { status: 500 });
  } finally {
    await client.close();
  }
}
