// 사용자 프로필 페이지
// 로그인한 사용자의 프로필 정보, 작성한 리뷰/댓글을 표시

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth-helpers';
import {
  get_current_user_profile,
  get_reviews_by_user_id,
  get_comments_by_user_id,
} from '@/lib/repositories/user-repository';
import { supabase } from '@/lib/supabase/client';
import UserProfileHeader from '@/components/profile/UserProfileHeader';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import UserReviewsList from '@/components/profile/UserReviewsList';
import UserCommentsList from '@/components/profile/UserCommentsList';
import { Loading, ErrorMessage } from '@/components/ui';
import type { UserProfile } from '@/types/auth';
import type { Review } from '@/types/review';
import type { Comment } from '@/types/comment';
import type { Brand } from '@/types/brand';

export default function ProfilePage() {
  const router = useRouter();
  const [is_loading, set_is_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);
  const [profile, set_profile] = useState<UserProfile | null>(null);
  const [reviews, set_reviews] = useState<Review[]>([]);
  const [reviews_count, set_reviews_count] = useState(0);
  const [comments, set_comments] = useState<Comment[]>([]);
  const [comments_count, set_comments_count] = useState(0);
  const [brands, set_brands] = useState<Brand[]>([]);
  const [is_editing, set_is_editing] = useState(false);
  const [reviews_offset, set_reviews_offset] = useState(0);
  const [comments_offset, set_comments_offset] = useState(0);
  const [reviews_has_more, set_reviews_has_more] = useState(false);
  const [comments_has_more, set_comments_has_more] = useState(false);

  const limit = 10;

  // 초기 데이터 로드
  useEffect(() => {
    load_data();
  }, []);

  const load_data = async () => {
    try {
      set_is_loading(true);
      set_error(null);

      // 로그인 확인
      const user = await getCurrentUser();
      if (!user) {
        router.push('/auth/login?redirect=/profile');
        return;
      }

      // 프로필, 리뷰, 댓글 데이터 병렬 로드
      const [profile_data, reviews_data, comments_data] = await Promise.all([
        get_current_user_profile(),
        get_reviews_by_user_id(user.id, limit, 0),
        get_comments_by_user_id(user.id, limit, 0),
      ]);

      // 브랜드 데이터 별도 로드 (클라이언트에서 직접 호출)
      let brands_data: Brand[] = [];
      try {
        const { data: brands, error: brands_error } = await supabase
          .from('brands')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        
        if (!brands_error && brands) {
          brands_data = brands as Brand[];
        }
      } catch (err) {
        console.error('브랜드 데이터 로드 오류:', err);
      }

      set_profile(profile_data);
      set_reviews(reviews_data.reviews);
      set_reviews_count(reviews_data.count);
      set_reviews_has_more(reviews_data.reviews.length < reviews_data.count);
      set_comments(comments_data.comments);
      set_comments_count(comments_data.count);
      set_comments_has_more(comments_data.comments.length < comments_data.count);
      set_brands(brands_data);
    } catch (err: any) {
      console.error('프로필 데이터 로드 오류:', err);
      set_error(err.message || '프로필 데이터를 불러올 수 없습니다.');
    } finally {
      set_is_loading(false);
    }
  };

  const handle_profile_save = async (updates: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error_data = await response.json();
        throw new Error(error_data.error || '프로필 업데이트에 실패했습니다.');
      }

      const updated_profile = await response.json();
      set_profile(updated_profile);
      set_is_editing(false);
    } catch (err: any) {
      throw err;
    }
  };

  const handle_load_more_reviews = async () => {
    if (!profile) return;

    try {
      const new_offset = reviews_offset + limit;
      const data = await get_reviews_by_user_id(profile.id, limit, new_offset);
      set_reviews((prev) => [...prev, ...data.reviews]);
      set_reviews_offset(new_offset);
      set_reviews_has_more(data.reviews.length < data.count - new_offset);
    } catch (err: any) {
      console.error('리뷰 더보기 오류:', err);
    }
  };

  const handle_load_more_comments = async () => {
    if (!profile) return;

    try {
      const new_offset = comments_offset + limit;
      const data = await get_comments_by_user_id(profile.id, limit, new_offset);
      set_comments((prev) => [...prev, ...data.comments]);
      set_comments_offset(new_offset);
      set_comments_has_more(data.comments.length < data.count - new_offset);
    } catch (err: any) {
      console.error('댓글 더보기 오류:', err);
    }
  };

  if (is_loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading full_screen={false} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage message="프로필을 찾을 수 없습니다." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 프로필 헤더 */}
        <UserProfileHeader
          profile={profile}
          is_editing={is_editing}
          on_edit_click={() => set_is_editing(!is_editing)}
        />

        {/* 프로필 수정 폼 */}
        {is_editing && (
          <div className="mb-6">
            <ProfileEditForm
              profile={profile}
              brands={brands}
              on_save={handle_profile_save}
              on_cancel={() => set_is_editing(false)}
            />
          </div>
        )}

        {/* 리뷰 목록 */}
        <div className="mb-6">
          <UserReviewsList
            reviews={reviews}
            total_count={reviews_count}
            on_load_more={reviews_has_more ? handle_load_more_reviews : undefined}
            has_more={reviews_has_more}
          />
        </div>

        {/* 댓글 목록 */}
        <div className="mb-6">
          <UserCommentsList
            comments={comments}
            total_count={comments_count}
            on_load_more={comments_has_more ? handle_load_more_comments : undefined}
            has_more={comments_has_more}
          />
        </div>
      </div>
    </div>
  );
}

