// Metricool API Service
// Replace these with your actual Metricool API credentials

const METRICOOL_API_BASE = process.env.REACT_APP_METRICOOL_API_URL || 'https://api.metricool.com/v1';
const METRICOOL_API_KEY = process.env.REACT_APP_METRICOOL_API_KEY || '';

export interface MetricoolMetric {
  name: string;
  value: number;
  change?: number;
  platform: 'instagram' | 'facebook';
}

export interface MetricoolPost {
  id: string;
  platform: 'instagram' | 'facebook';
  caption: string;
  image?: string;
  likes: number;
  comments: number;
  clicks?: number;
  shares?: number;
  impressions: number;
  reach: number;
  engagement: number;
  createdAt: string;
}

export interface MetricoolAdCampaign {
  id: string;
  source: 'facebook';
  campaign: string;
  impressions: number;
  clicks: number;
  amountSpent: number;
  postEngagement: number;
  pageEngagement: number;
  pageLikes: number;
  reach: number;
}

export interface MetricoolData {
  source: 'live' | 'mock';
  metrics: MetricoolMetric[];
  posts: MetricoolPost[];
  adCampaigns?: MetricoolAdCampaign[];
  dateRange: {
    start: string;
    end: string;
  };
}

// Fetch Instagram and Facebook metrics from Metricool
export const fetchMetricoolData = async (
  startDate?: string,
  endDate?: string
): Promise<MetricoolData> => {
  try {
    // TODO: Replace with actual Metricool API endpoints
    // Example structure - adjust based on Metricool API documentation
    
    const response = await fetch(
      `${METRICOOL_API_BASE}/analytics?platform=instagram,facebook&start_date=${startDate || '2025-11-11'}&end_date=${endDate || '2025-12-10'}`,
      {
        headers: {
          'Authorization': `Bearer ${METRICOOL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Metricool API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform Metricool response to our format
    return {
      source: 'live',
      metrics: data.metrics || [],
      posts: data.posts || [],
      adCampaigns: data.adCampaigns || [],
      dateRange: {
        start: startDate || '2025-11-11',
        end: endDate || '2025-12-10',
      },
    };
  } catch (error) {
    console.error('Error fetching Metricool data:', error);
    // Return mock data for development
    return getMockMetricoolData();
  }
};

// Mock data for development/testing
export const getMockMetricoolData = (): MetricoolData => {
  return {
    source: 'mock',
    metrics: [
      {
        name: 'Followers',
        value: 3,
        platform: 'instagram',
      },
      {
        name: 'Following',
        value: 1,
        platform: 'instagram',
      },
      {
        name: 'Total Content',
        value: 12,
        platform: 'instagram',
      },
      {
        name: 'Views',
        value: 53,
        platform: 'instagram',
      },
      {
        name: 'Avg Reach Per Day',
        value: 2,
        platform: 'instagram',
      },
      {
        name: 'Facebook Followers',
        value: 0,
        platform: 'facebook',
      },
      {
        name: 'Facebook Total Content',
        value: 8,
        platform: 'facebook',
      },
    ],
    posts: [
      {
        id: 'ig-1',
        platform: 'instagram',
        caption: '3 best gift ideas to give your seniors this Christmas! 🎁',
        likes: 5,
        comments: 0,
        clicks: 22,
        impressions: 45,
        reach: 40,
        engagement: 7,
        createdAt: '2025-11-17T09:00:00Z',
      },
      {
        id: 'ig-2',
        platform: 'instagram',
        caption: 'Holiday savings with Cash 4 Gold Beckley ✨',
        likes: 3,
        comments: 1,
        clicks: 12,
        impressions: 33,
        reach: 28,
        engagement: 5,
        createdAt: '2025-11-26T13:15:00Z',
      },
      {
        id: 'ig-3',
        platform: 'instagram',
        caption: 'Why seniors love trusted gold buyers ❤️',
        likes: 4,
        comments: 0,
        clicks: 9,
        impressions: 29,
        reach: 26,
        engagement: 4,
        createdAt: '2025-12-02T15:45:00Z',
      },
      {
        id: 'ig-4',
        platform: 'instagram',
        caption: 'Our Beckley community events recap 📸',
        likes: 2,
        comments: 0,
        clicks: 6,
        impressions: 21,
        reach: 19,
        engagement: 3,
        createdAt: '2025-12-05T12:20:00Z',
      },
      {
        id: 'ig-5',
        platform: 'instagram',
        caption: 'Meet the Walker Advisor team 🤝',
        likes: 1,
        comments: 0,
        clicks: 4,
        impressions: 18,
        reach: 16,
        engagement: 2,
        createdAt: '2025-12-08T08:30:00Z',
      },
      {
        id: 'fb-1',
        platform: 'facebook',
        caption: 'Holiday trading hours update 🕒',
        likes: 2,
        comments: 0,
        clicks: 10,
        shares: 1,
        impressions: 30,
        reach: 27,
        engagement: 4,
        createdAt: '2025-11-20T11:00:00Z',
      },
      {
        id: 'fb-2',
        platform: 'facebook',
        caption: 'Customer spotlight: Thank you Beckley! 🌟',
        likes: 3,
        comments: 1,
        clicks: 11,
        shares: 2,
        impressions: 37,
        reach: 31,
        engagement: 6,
        createdAt: '2025-12-03T10:10:00Z',
      },
    ],
    adCampaigns: [
      {
        id: 'fb-ad-1',
        source: 'facebook',
        campaign: "Post: 'At Little Sicily, we're more than a restaurant...'",
        impressions: 3700,
        clicks: 217,
        amountSpent: 192,
        postEngagement: 115,
        pageEngagement: 116,
        pageLikes: 1,
        reach: 2600,
      },
      {
        id: 'fb-ad-2',
        source: 'facebook',
        campaign: 'Post: "Little Sicily holiday offer - December special"',
        impressions: 2100,
        clicks: 146,
        amountSpent: 108,
        postEngagement: 82,
        pageEngagement: 74,
        pageLikes: 2,
        reach: 1800,
      },
    ],
    dateRange: {
      start: '2025-11-11',
      end: '2025-12-10',
    },
  };
};

// Get metrics by platform
export const getMetricsByPlatform = (
  data: MetricoolData,
  platform: 'instagram' | 'facebook'
): MetricoolMetric[] => {
  return data.metrics.filter((m) => m.platform === platform);
};

// Get posts by platform
export const getPostsByPlatform = (
  data: MetricoolData,
  platform: 'instagram' | 'facebook'
): MetricoolPost[] => {
  return data.posts.filter((p) => p.platform === platform);
};
