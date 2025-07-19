import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../lib/User';
import { sendOtpEmail } from '../../../../../lib/emailService';

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email } = await request.json();
    
    console.log('Request OTP for email:', email);
    
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log('Generated OTP:', otp);

    // Upsert user with OTP
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { otp, otpExpires } },
      { upsert: true, new: true }
    );

    console.log('User updated:', user.email);

    // Send OTP via email
    const emailSent = await sendOtpEmail(email, otp);
    
    if (emailSent) {
      return NextResponse.json({ success: true, message: 'OTP sent to your email' });
    } else {
      return NextResponse.json({ success: false, message: 'Failed to send email. Please try again.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in request-otp:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 