import axios from 'axios';
export type SupportedPlatform = 'twitter' | 'youtube' | 'github';

const API_KEYS = {
  TWITTER: process.env.TWITTER_API_KEY,
  YOUTUBE: process.env.YOUTUBE_API_KEY,
  GITHUB: process.env.GITHUB_API_KEY,
};

export async function fetchTwitterData(handle: string) {
  try {
    const response = await axios.get(
      `https://api.twitter.com/2/users/by/username/${handle}?user.fields=public_metrics,created_at,verified,description`,
      {
        headers: {
          Authorization: `Bearer ${API_KEYS.TWITTER}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching Twitter data for ${handle}:`, error);
    return null;
  }
}

export async function fetchYouTubeData(channelId: string) {
  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/channels',
      {
        params: {
          part: 'snippet,statistics',
          id: channelId,
          key: API_KEYS.YOUTUBE
        }
      }
    );
    return response.data.items[0];
  } catch (error) {
    console.error(`Error fetching YouTube data for ${channelId}:`, error);
    return null;
  }
}

export async function fetchGitHubData(handle: string) {
  try {
    const response = await axios.get(`https://api.github.com/users/${handle}`, {
      headers: {
        Authorization: API_KEYS.GITHUB ? `Bearer ${API_KEYS.GITHUB}` : '',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching GitHub data for ${handle}:`, error);
    return null;
  }
}

export async function fetchNewsData(query: string) {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        apiKey: process.env.NEWS_API_KEY,
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: 10
      }
    });
    return response.data.articles;
  } catch (error) {
    console.error(`Error fetching news data for ${query}:`, error);
    return [];
  }
}