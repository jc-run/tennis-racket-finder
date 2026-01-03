'use client';

// 댓글 작성 폼 컴포넌트
// 로그인한 사용자가 댓글을 작성할 수 있는 폼

import { useState } from 'react';
import { Button } from '@/components/ui';
import AuthGuard from '@/lib/auth/auth-guard';
import { supabase } from '@/lib/supabase/client';

interface CommentFormProps {
  racket_id: string;
  parent_comment_id?: string | null;
  on_success?: () => void;
  on_cancel?: () => void;
  placeholder?: string;
}

/**
 * CommentForm 컴포넌트
 * 
 * @param racket_id - 라켓 ID
 * @param parent_comment_id - 대댓글인 경우 부모 댓글 ID
 * @param on_success - 댓글 작성 성공 시 콜백
 * @param on_cancel - 취소 버튼 클릭 시 콜백
 * @param placeholder - 입력 필드 placeholder
 */
export default function CommentForm({
  racket_id,
  parent_comment_id = null,
  on_success,
  on_cancel,
  placeholder = '댓글을 입력하세요...',
}: CommentFormProps) {
  const [content, set_content] = useState('');
  const [is_submitting, set_is_submitting] = useState(false);
  const [error, set_error] = useState<string | null>(null);

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    set_error(null);

    // 유효성 검사
    if (!content.trim()) {
      set_error('댓글 내용을 입력해주세요.');
      return;
    }

    if (content.trim().length < 2) {
      set_error('댓글 내용은 최소 2자 이상 입력해주세요.');
      return;
    }

    set_is_submitting(true);

    try {
      // 현재 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        set_error('로그인이 필요합니다.');
        return;
      }

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          racket_id,
          content: content.trim(),
          parent_comment_id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '댓글 작성에 실패했습니다.');
      }

      // 성공 시 폼 초기화
      set_content('');

      // 콜백 실행
      if (on_success) {
        on_success();
      }
    } catch (err: any) {
      set_error(err.message || '댓글 작성에 실패했습니다.');
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <AuthGuard>
      <form onSubmit={handle_submit} className="space-y-3">
        <div>
          <textarea
            value={content}
            onChange={(e) => set_content(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
            minLength={2}
          />
          <p className="mt-1 text-sm text-gray-500">
            {content.length} / 최소 2자
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex justify-end gap-2">
          {on_cancel && (
            <Button
              type="button"
              variant="outline"
              onClick={on_cancel}
              disabled={is_submitting}
            >
              취소
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            is_loading={is_submitting}
            disabled={is_submitting || !content.trim()}
          >
            {parent_comment_id ? '답글 작성' : '댓글 작성'}
          </Button>
        </div>
      </form>
    </AuthGuard>
  );
}

