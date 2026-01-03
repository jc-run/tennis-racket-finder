// 프로필 수정 폼 컴포넌트

'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import type { UserProfile } from '@/types/auth';
import type { Brand } from '@/types/brand';

interface ProfileEditFormProps {
  profile: UserProfile;
  brands?: Brand[];
  on_save: (updates: Partial<UserProfile>) => Promise<void>;
  on_cancel: () => void;
}

export default function ProfileEditForm({
  profile,
  brands = [],
  on_save,
  on_cancel,
}: ProfileEditFormProps) {
  const [form_data, set_form_data] = useState({
    username: profile.username || '',
    display_name: profile.display_name || '',
    bio: profile.bio || '',
    play_level: profile.play_level || '',
    favorite_brand_id: profile.favorite_brand_id || '',
  });
  const [is_loading, set_is_loading] = useState(false);
  const [error, set_error] = useState<string | null>(null);

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    set_error(null);
    set_is_loading(true);

    try {
      await on_save(form_data);
    } catch (err: any) {
      set_error(err.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      set_is_loading(false);
    }
  };

  const handle_change = (field: string, value: string) => {
    set_form_data((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handle_submit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">프로필 수정</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="사용자명"
          type="text"
          value={form_data.username}
          onChange={(e) => handle_change('username', e.target.value)}
          placeholder="사용자명을 입력하세요"
          maxLength={50}
        />

        <Input
          label="표시 이름"
          type="text"
          value={form_data.display_name}
          onChange={(e) => handle_change('display_name', e.target.value)}
          placeholder="표시할 이름을 입력하세요"
          maxLength={100}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            소개
          </label>
          <textarea
            value={form_data.bio}
            onChange={(e) => handle_change('bio', e.target.value)}
            placeholder="자기소개를 입력하세요"
            maxLength={500}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            {form_data.bio.length}/500
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            플레이 레벨
          </label>
          <select
            value={form_data.play_level}
            onChange={(e) => handle_change('play_level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">선택하세요</option>
            <option value="초급">초급</option>
            <option value="중급">중급</option>
            <option value="고급">고급</option>
            <option value="프로">프로</option>
          </select>
        </div>

        {brands.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              선호 브랜드
            </label>
            <select
              value={form_data.favorite_brand_id}
              onChange={(e) => handle_change('favorite_brand_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">선택하세요</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <Button
          type="submit"
          variant="primary"
          is_loading={is_loading}
          disabled={is_loading}
        >
          저장
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={on_cancel}
          disabled={is_loading}
        >
          취소
        </Button>
      </div>
    </form>
  );
}

