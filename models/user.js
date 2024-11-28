import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
    videoId: { type: String, required: true },
    title: { type: String, required: true },
    thumbnail: { type: String },
    liked: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },  
    email: { type: String, unique: true, required: true },
    name: { type: String },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    songs: [SongSchema]  // Array of songs associated with the user
});

// Ensure the model is only created once
export default mongoose.models.User || mongoose.model('User', UserSchema);