// pages/api/add-song.js
import dbConnect from '../../lib/mongodb';
import User from '../../models/user';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userId, song } = req.body;

        if (!userId || !song) {
            return res.status(400).json({ message: 'Missing userId or song data' });
        }

        await dbConnect();

        const user = await User.findOneAndUpdate(
            { userId: userId },
            { $addToSet: { songs: song } }, // Add song to user's songs array
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Song added successfully' });
    } catch (error) {
        console.error('Error adding song:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}