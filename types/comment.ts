// 댓글 관련 타입 정의

export interface Comment {
  id: string;
  racket_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
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
  
  // 대댓글 (재귀적 구조)
  replies?: Comment[];
}

