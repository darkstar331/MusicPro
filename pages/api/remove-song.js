// pages/api/remove-song.js
import dbConnect from '../../lib/mongodb';
import User from '../../models/user';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userId, videoId } = req.body;

        if (!userId || !videoId) {
            return res.status(400).json({ message: 'Missing userId or videoId' });
        }

        await dbConnect();

        const user = await User.findOneAndUpdate(
            { userId: userId },
            { $pull: { songs: { videoId: videoId } } }, // Remove song from user's songs array
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Song removed successfully' });
    } catch (error) {
        console.error('Error removing song:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}