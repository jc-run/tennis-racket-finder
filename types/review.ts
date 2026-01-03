// 리뷰 관련 타입 정의

export interface Review {
  id: string;
  racket_id: string;
  user_id: string;
  rating: number; // 1~5
  title: string | null;
  content: string;
  play_style: string | null;
  experience_level: string | null;
  usage_duration: string | null;
  helpful_count: number;
  not_helpful_count: number;
  is_verified_purchase: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  
  // 관계 데이터
  user_profiles?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
}

// 리뷰 통계
export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

