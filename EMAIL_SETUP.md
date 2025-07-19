# Email Setup Guide for OTP System

## Step 1: Create Gmail App Password

1. **Go to your Google Account settings**: https://myaccount.google.com/
2. **Navigate to Security** → **2-Step Verification** (enable if not already enabled)
3. **Go to App passwords** (under 2-Step Verification)
4. **Select "Mail"** and **"Other (Custom name)"**
5. **Enter a name** like "Ray Cricket OTP"
6. **Copy the generated 16-character password**

## Step 2: Create Environment File

Create a file named `.env.local` in your project root with:

```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
```

**Replace:**
- `your-gmail@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the app password from Step 1

## Step 3: Restart Your Development Server

```bash
npm run dev
```

## Step 4: Test the OTP System

1. Go to `/signup`
2. Enter your email address
3. Click "Send OTP"
4. Check your Gmail inbox (and spam folder)
5. Enter the OTP from the email
6. Complete registration

## Troubleshooting

- **Email not received**: Check spam folder
- **Authentication error**: Verify app password is correct
- **Connection error**: Ensure 2FA is enabled on your Gmail account

## Security Notes

- Never commit `.env.local` to version control
- Use app passwords, not your main Gmail password
- The app password is only for this application 