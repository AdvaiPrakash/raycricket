import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

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

export async function DELETE(request: Request) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json({ success: false, message: 'MONGODB_URI not set' }, { status: 500 });
  }
  const client = new MongoClient(uri);
  try {
    const { _id } = await request.json();
    if (!_id) {
      return NextResponse.json({ success: false, message: 'Missing _id' }, { status: 400 });
    }
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('players');
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });
    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Player not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete player' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PATCH(request: Request) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json({ success: false, message: 'MONGODB_URI not set' }, { status: 500 });
  }
  const client = new MongoClient(uri);
  try {
    const body = await request.json();
    const { _id, ...updateFields } = body;
    if (!_id) {
      return NextResponse.json({ success: false, message: 'Missing _id' }, { status: 400 });
    }
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('players');
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateFields }
    );
    if (result.matchedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Player not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json({ success: false, message: 'Failed to update player' }, { status: 500 });
  } finally {
    await client.close();
  }
}
