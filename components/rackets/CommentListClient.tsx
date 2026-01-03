'use client';

// CommentList 클라이언트 컴포넌트
// 댓글 작성 후 목록을 새로고침하는 기능 포함

import { useRouter } from 'next/navigation';
import CommentList from './CommentList';
import type { Comment } from '@/types/comment';

interface CommentListClientProps {
  comments: Comment[];
  racket_id: string;
}

/**
 * CommentListClient 컴포넌트
 * 댓글 작성 후 페이지를 새로고침하여 최신 댓글을 표시
 */
export default function CommentListClient({
  comments,
  racket_id,
}: CommentListClientProps) {
  const router = useRouter();

  const handle_refresh = () => {
    router.refresh();
  };

  return (
    <CommentList
      comments={comments}
      racket_id={racket_id}
      on_refresh={handle_refresh}
    />
  );
}

