import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../lib/User';

export async function POST(request: NextRequest) {
  await dbConnect();
  const { email, otp } = await request.json();
  if (!email || !otp) {
    return NextResponse.json({ success: false, message: 'Email and OTP are required' }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user || !user.otp || !user.otpExpires) {
    return NextResponse.json({ success: false, message: 'OTP not found. Please request again.' }, { status: 400 });
  }

  if (user.otp !== otp) {
    return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
  }

  if (user.otpExpires < new Date()) {
    return NextResponse.json({ success: false, message: 'OTP expired' }, { status: 400 });
  }

  // OTP is valid, clear it (but allow password setup)
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  return NextResponse.json({ success: true, message: 'OTP verified' });
} 