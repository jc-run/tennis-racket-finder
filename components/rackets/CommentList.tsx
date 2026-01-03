'use client';

// 댓글 목록 컴포넌트
// 라켓의 댓글 목록을 표시하는 컴포넌트 (대댓글 포함)

import { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import CommentForm from './CommentForm';
import ReplyForm from './ReplyForm';
import type { Comment } from '@/types/comment';

interface CommentListProps {
  comments: Comment[];
  racket_id: string;
  on_refresh?: () => void;
}

/**
 * CommentItem 컴포넌트 (재귀적 구조)
 */
function CommentItem({
  comment,
  racket_id,
  on_refresh,
}: {
  comment: Comment;
  racket_id: string;
  on_refresh?: () => void;
}) {
  const [show_reply_form, set_show_reply_form] = useState(false);

  const handle_reply_success = () => {
    set_show_reply_form(false);
    if (on_refresh) {
      on_refresh();
    }
  };

  return (
    <div className="border-l-2 border-gray-200 pl-4 py-3">
      {/* 댓글 헤더 */}
      <div className="flex items-center gap-3 mb-2">
        {/* 사용자 아바타 */}
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          {comment.user_profiles?.avatar_url ? (
            <img
              src={comment.user_profiles.avatar_url}
              alt={comment.user_profiles.display_name || 'User'}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-xs">
              {comment.user_profiles?.display_name?.[0] ||
                comment.user_profiles?.username?.[0] ||
                'U'}
            </span>
          )}
        </div>

        {/* 사용자 정보 */}
        <div className="flex-1">
          <div className="font-medium text-gray-900 text-sm">
            {comment.user_profiles?.display_name ||
              comment.user_profiles?.username ||
              '익명'}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleDateString('ko-KR')}
          </div>
        </div>
      </div>

      {/* 댓글 내용 */}
      <p className="text-gray-700 whitespace-pre-wrap text-sm mb-3">
        {comment.content}
      </p>

      {/* 답글 버튼 */}
      <button
        onClick={() => set_show_reply_form(!show_reply_form)}
        className="text-sm text-blue-600 hover:text-blue-700 mb-3"
      >
        {show_reply_form ? '답글 취소' : '답글 작성'}
      </button>

      {/* 답글 폼 */}
      {show_reply_form && (
        <ReplyForm
          racket_id={racket_id}
          parent_comment_id={comment.id}
          on_success={handle_reply_success}
          on_cancel={() => set_show_reply_form(false)}
        />
      )}

      {/* 대댓글 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              racket_id={racket_id}
              on_refresh={on_refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * CommentList 컴포넌트
 * 
 * @param comments - 댓글 배열 (대댓글 포함)
 * @param racket_id - 라켓 ID
 * @param on_refresh - 댓글 목록 새로고침 콜백
 */
export default function CommentList({
  comments,
  racket_id,
  on_refresh,
}: CommentListProps) {
  const [show_form, set_show_form] = useState(false);

  const handle_success = () => {
    set_show_form(false);
    if (on_refresh) {
      on_refresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            댓글 ({comments.length})
          </h2>
          <button
            onClick={() => set_show_form(!show_form)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {show_form ? '작성 취소' : '댓글 작성'}
          </button>
        </div>
      </CardHeader>
      <CardBody>
        {/* 댓글 작성 폼 */}
        {show_form && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <CommentForm
              racket_id={racket_id}
              on_success={handle_success}
              on_cancel={() => set_show_form(false)}
            />
          </div>
        )}

        {/* 댓글 목록 */}
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            아직 댓글이 없습니다.
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                racket_id={racket_id}
                on_refresh={on_refresh}
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

