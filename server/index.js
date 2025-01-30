import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core';
import { TwitterApi } from 'twitter-api-v2';
import { IgApiClient } from 'instagram-private-api';

const app = express();
app.use(cors());
app.use(express.json());

// YouTube handler
app.get('/api/youtube/info', async (req, res) => {
  try {
    const { url } = req.query;
    const info = await ytdl.getInfo(url);
    
    const formats = info.formats.map(format => ({
      quality: format.qualityLabel || format.quality,
      format: format.container,
      url: format.url,
      hasAudio: format.hasAudio,
      hasVideo: format.hasVideo
    }));

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      duration: info.videoDetails.lengthSeconds,
      formats
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Twitter/X handler
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

app.get('/api/twitter/info', async (req, res) => {
  try {
    const { url } = req.query;
    const tweetId = url.split('/').pop();
    const tweet = await twitterClient.v1.getTweet(tweetId, {
      include_entities: true,
      tweet_mode: 'extended',
    });

    if (!tweet.extended_entities?.media) {
      throw new Error('No media found in tweet');
    }

    const videos = tweet.extended_entities.media
      .filter(media => media.type === 'video')
      .map(media => ({
        variants: media.video_info.variants
          .filter(v => v.content_type === 'video/mp4')
          .map(v => ({
            url: v.url,
            bitrate: v.bitrate,
          }))
      }));

    res.json({
      text: tweet.full_text,
      videos
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Instagram handler
const ig = new IgApiClient();

app.get('/api/instagram/info', async (req, res) => {
  try {
    const { url } = req.query;
    const mediaId = url.split('/p/')[1].split('/')[0];
    
    // Note: Instagram requires authentication
    // This is a simplified version
    const info = await ig.media.info(mediaId);
    
    res.json({
      type: info.media_type,
      url: info.video_versions?.[0]?.url
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
