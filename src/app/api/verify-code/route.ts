import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ message: 'POST username and code to verify' }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const username = body?.username;
    const code = body?.code;

    if (!username || !code) {
      return Response.json(
        { success: false, message: 'Username and code are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const decodedUsername = decodeURIComponent(String(username)).trim();
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      console.error('Verify code: user not found for username', decodedUsername);
      return Response.json(
        { success: false, message: 'User not found. Please complete sign-up first or use the correct verify link.' },
        { status: 400 }
      );
    }

    // Check if the code is correct and not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: 'Account verified successfully' },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      // Code has expired
      return Response.json(
        {
          success: false,
          message:
            'Verification code has expired. Please sign up again to get a new code.',
        },
        { status: 400 }
      );
    } else {
      // Code is incorrect
      return Response.json(
        { success: false, message: 'Invalid verification code' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return Response.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }
}