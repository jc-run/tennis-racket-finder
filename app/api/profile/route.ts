// 프로필 업데이트 API

import { NextRequest, NextResponse } from 'next/server';
import { get_user_from_request } from '@/lib/utils/get-user-from-request';
import { update_user_profile } from '@/lib/repositories/user-repository';

/**
 * 프로필 업데이트 (PUT)
 */
export async function PUT(request: NextRequest) {
  try {
    // 사용자 인증
    const user = await get_user_from_request(request);
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { username, display_name, bio, play_level, favorite_brand_id, avatar_url } = body;

    // 유효성 검사
    if (username && (username.length < 2 || username.length > 50)) {
      return NextResponse.json(
        { error: '사용자명은 2자 이상 50자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    if (display_name && display_name.length > 100) {
      return NextResponse.json(
        { error: '표시 이름은 100자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: '소개는 500자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 업데이트할 필드만 추출
    const updates: any = {};
    if (username !== undefined) updates.username = username?.trim() || null;
    if (display_name !== undefined) updates.display_name = display_name?.trim() || null;
    if (bio !== undefined) updates.bio = bio?.trim() || null;
    if (play_level !== undefined) updates.play_level = play_level?.trim() || null;
    if (favorite_brand_id !== undefined) updates.favorite_brand_id = favorite_brand_id || null;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url?.trim() || null;

    // 프로필 업데이트
    const updated_profile = await update_user_profile(user.id, updates);

    return NextResponse.json(updated_profile, { status: 200 });
  } catch (error: any) {
    console.error('프로필 업데이트 API 예외:', error);
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

