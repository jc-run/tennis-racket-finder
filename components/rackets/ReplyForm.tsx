'use client';

// 대댓글 작성 폼 컴포넌트
// CommentForm의 래퍼 컴포넌트

import { useState } from 'react';
import CommentForm from './CommentForm';

interface ReplyFormProps {
  racket_id: string;
  parent_comment_id: string;
  on_success?: () => void;
  on_cancel?: () => void;
}

/**
 * ReplyForm 컴포넌트
 * 
 * @param racket_id - 라켓 ID
 * @param parent_comment_id - 부모 댓글 ID
 * @param on_success - 답글 작성 성공 시 콜백
 * @param on_cancel - 취소 버튼 클릭 시 콜백
 */
export default function ReplyForm({
  racket_id,
  parent_comment_id,
  on_success,
  on_cancel,
}: ReplyFormProps) {
  return (
    <div className="mt-3 pl-4 border-l-2 border-blue-200">
      <CommentForm
        racket_id={racket_id}
        parent_comment_id={parent_comment_id}
        on_success={on_success}
        on_cancel={on_cancel}
        placeholder="답글을 입력하세요..."
      />
    </div>
  );
}

