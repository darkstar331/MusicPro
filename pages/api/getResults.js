import axios from "axios";

export default async function handler(req, res) {
  const { query } = req.query;

  const apikey = "AIzaSyAnEBYcfHVXkf6LGJDhvmQzvxywEu_ZmIo"

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apikey}`
    );

    const songs = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
      liked: false
    }));
    // console.log(songs)
    return res.status(200).json({ songs });

  } catch (error) {
    console.error('Error fetching data:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}