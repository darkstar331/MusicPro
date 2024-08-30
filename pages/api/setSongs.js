import dbConnect from '@/lib/mongodb';
import User from '@/models/user';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        // Handle saving playlist
        try {
            const { userId, playlist } = req.body;

            if (!userId || !playlist) {
                return res.status(400).json({ message: 'Missing userId or playlist data' });
            }

            const user = await User.findOneAndUpdate(
                { userId: userId },
                { $set: { songs: playlist } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'Playlist saved successfully' });
        } catch (error) {
            console.error('Error saving playlist:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else if (req.method === 'GET') {
        // Handle fetching playlist
        try {
            const userId = req.query.userId;

            if (!userId) {
                return res.status(400).json({ message: 'Missing userId' });
            }

            const user = await User.findOne({ userId: userId });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ playlist: user.songs });
        } catch (error) {
            console.error('Error fetching playlist:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

