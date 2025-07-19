import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../lib/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  await dbConnect();
  const { name, email, mobile, password } = await request.json();
  if (!name || !email || !mobile || !password) {
    return NextResponse.json({ success: false, message: 'Name, email, mobile, and password are required' }, { status: 400 });
  }

  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ success: false, message: 'User already registered with this email' }, { status: 400 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  await User.create({ name, email, mobile, password: hashedPassword });
  return NextResponse.json({ success: true, message: 'Registration successful' });
} 