// 사용자 프로필 헤더 컴포넌트
// 프로필 이미지, 이름, 소개 등을 표시

'use client';

import Image from 'next/image';
import type { UserProfile } from '@/types/auth';

interface UserProfileHeaderProps {
  profile: UserProfile;
  is_editing?: boolean;
  on_edit_click?: () => void;
}

export default function UserProfileHeader({
  profile,
  is_editing = false,
  on_edit_click,
}: UserProfileHeaderProps) {
  const display_name = profile.display_name || profile.username || '사용자';
  const avatar_url = profile.avatar_url || 'https://via.placeholder.com/128?text=User';

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* 프로필 이미지 */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 flex-shrink-0">
          <Image
            src={avatar_url}
            alt={`${display_name} 프로필`}
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>

        {/* 프로필 정보 */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {display_name}
          </h1>
          {profile.username && profile.username !== display_name && (
            <p className="text-gray-500 mb-4">@{profile.username}</p>
          )}
          {profile.bio && (
            <p className="text-gray-700 mb-4">{profile.bio}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {profile.play_level && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {profile.play_level}
              </span>
            )}
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
              가입일: {new Date(profile.created_at).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>

        {/* 편집 버튼 */}
        {on_edit_click && (
          <button
            onClick={on_edit_click}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {is_editing ? '취소' : '프로필 수정'}
          </button>
        )}
      </div>
    </div>
  );
}

