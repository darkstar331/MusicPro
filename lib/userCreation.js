// /lib/userCreation.js
import User from '@/models/user';
import dbConnect from '@/lib/mongodb';

export async function triggerUserCreation(user, account) {
  // Wrap in an asynchronous IIFE to handle the user creation asynchronously
  (async () => {
    try {
      // Connect to MongoDB
      await dbConnect();

      // Check if the user already exists
      const existingUser = await User.findOne({ email: user.email });

      // If the user doesn't exist, create a new user
      if (!existingUser) {
        const newUser = new User({
          userId: account.providerAccountId,
          email: user.email,
          name: user.name,
          imageUrl: user.image,
        });

        await newUser.save();
        console.log('User created successfully:', newUser);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  })();
}
