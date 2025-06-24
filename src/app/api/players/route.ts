import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
const dbName = 'playerdb';

export async function GET() {
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
