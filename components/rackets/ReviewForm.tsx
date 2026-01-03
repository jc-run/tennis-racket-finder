'use client';

// 리뷰 작성 폼 컴포넌트
// 로그인한 사용자가 리뷰를 작성할 수 있는 폼

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import RatingStars from './RatingStars';
import AuthGuard from '@/lib/auth/auth-guard';

interface ReviewFormProps {
  racket_id: string;
  on_success?: () => void;
}

/**
 * ReviewForm 컴포넌트
 * 
 * @param racket_id - 라켓 ID
 * @param on_success - 리뷰 작성 성공 시 콜백
 */
export default function ReviewForm({ racket_id, on_success }: ReviewFormProps) {
  const [rating, set_rating] = useState<number>(0);
  const [title, set_title] = useState('');
  const [content, set_content] = useState('');
  const [play_style, set_play_style] = useState('');
  const [experience_level, set_experience_level] = useState('');
  const [usage_duration, set_usage_duration] = useState('');
  const [is_submitting, set_is_submitting] = useState(false);
  const [error, set_error] = useState<string | null>(null);

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    set_error(null);

    // 유효성 검사
    if (rating === 0) {
      set_error('평점을 선택해주세요.');
      return;
    }

    if (!content.trim()) {
      set_error('리뷰 내용을 입력해주세요.');
      return;
    }

    if (content.trim().length < 10) {
      set_error('리뷰 내용은 최소 10자 이상 입력해주세요.');
      return;
    }

    set_is_submitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          racket_id,
          rating,
          title: title.trim() || null,
          content: content.trim(),
          play_style: play_style.trim() || null,
          experience_level: experience_level.trim() || null,
          usage_duration: usage_duration.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '리뷰 작성에 실패했습니다.');
      }

      // 성공 시 폼 초기화
      set_rating(0);
      set_title('');
      set_content('');
      set_play_style('');
      set_experience_level('');
      set_usage_duration('');

      // 콜백 실행
      if (on_success) {
        on_success();
      }
    } catch (err: any) {
      set_error(err.message || '리뷰 작성에 실패했습니다.');
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          리뷰 작성
        </h3>

        <form onSubmit={handle_submit} className="space-y-4">
          {/* 평점 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              평점 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => set_rating(star)}
                  className="focus:outline-none"
                  aria-label={`${star}점`}
                >
                  <svg
                    className={`w-8 h-8 transition-colors ${
                      star <= rating
                        ? 'text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  {rating}점 선택됨
                </span>
              )}
            </div>
          </div>

          {/* 리뷰 제목 */}
          <Input
            label="리뷰 제목 (선택)"
            value={title}
            onChange={(e) => set_title(e.target.value)}
            placeholder="리뷰 제목을 입력하세요"
            maxLength={200}
          />

          {/* 리뷰 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              리뷰 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => set_content(e.target.value)}
              placeholder="리뷰 내용을 입력하세요 (최소 10자)"
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              minLength={10}
            />
            <p className="mt-1 text-sm text-gray-500">
              {content.length} / 최소 10자
            </p>
          </div>

          {/* 추가 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="플레이 스타일 (선택)"
              value={play_style}
              onChange={(e) => set_play_style(e.target.value)}
              placeholder="예: 공격형, 방어형"
            />
            <Input
              label="경험 수준 (선택)"
              value={experience_level}
              onChange={(e) => set_experience_level(e.target.value)}
              placeholder="예: 초급, 중급, 고급"
            />
            <Input
              label="사용 기간 (선택)"
              value={usage_duration}
              onChange={(e) => set_usage_duration(e.target.value)}
              placeholder="예: 1개월, 6개월"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              is_loading={is_submitting}
              disabled={is_submitting || rating === 0 || !content.trim()}
            >
              리뷰 작성
            </Button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}

