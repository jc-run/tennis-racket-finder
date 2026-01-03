// 이미지 최적화 유틸리티
// 업로드 전 이미지를 최적화하여 용량을 줄임

import sharp from 'sharp';

// 프로필 이미지 최적화 설정
const PROFILE_IMAGE_CONFIG = {
  width: 400,
  height: 400,
  quality: 85,
  format: 'webp' as const,
};

// 일반 이미지 최적화 설정
const GENERAL_IMAGE_CONFIG = {
  max_width: 1920,
  max_height: 1920,
  quality: 85,
  format: 'webp' as const,
};

/**
 * 이미지를 최적화하여 버퍼로 반환
 * 
 * @param buffer - 원본 이미지 버퍼
 * @param options - 최적화 옵션
 * @returns 최적화된 이미지 버퍼
 */
export async function optimize_image(
  buffer: Buffer,
  options: {
    width?: number;
    height?: number;
    max_width?: number;
    max_height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): Promise<Buffer> {
  const {
    width,
    height,
    max_width = GENERAL_IMAGE_CONFIG.max_width,
    max_height = GENERAL_IMAGE_CONFIG.max_height,
    quality = GENERAL_IMAGE_CONFIG.quality,
    format = GENERAL_IMAGE_CONFIG.format,
  } = options;

  let sharp_instance = sharp(buffer);

  // 메타데이터 가져오기
  const metadata = await sharp_instance.metadata();

  // 리사이징 로직
  if (width && height) {
    // 정확한 크기로 리사이징 (프로필 이미지 등)
    sharp_instance = sharp_instance.resize(width, height, {
      fit: 'cover', // 비율을 유지하면서 지정된 크기에 맞춤 (크롭)
      position: 'center', // 중앙 기준으로 크롭
    });
  } else if (max_width || max_height) {
    // 최대 크기 제한 (비율 유지)
    const current_width = metadata.width || 0;
    const current_height = metadata.height || 0;

    if (current_width > max_width || current_height > max_height) {
      sharp_instance = sharp_instance.resize(max_width, max_height, {
        fit: 'inside', // 비율을 유지하면서 내부에 맞춤
        withoutEnlargement: true, // 확대하지 않음
      });
    }
  }

  // 포맷 변환 및 압축
  switch (format) {
    case 'webp':
      sharp_instance = sharp_instance.webp({ quality });
      break;
    case 'jpeg':
      sharp_instance = sharp_instance.jpeg({ quality, mozjpeg: true });
      break;
    case 'png':
      sharp_instance = sharp_instance.png({ quality: Math.floor(quality / 100 * 9), compressionLevel: 9 });
      break;
  }

  return await sharp_instance.toBuffer();
}

/**
 * 프로필 이미지 최적화 (정사각형, 400x400)
 * 
 * @param buffer - 원본 이미지 버퍼
 * @returns 최적화된 이미지 버퍼
 */
export async function optimize_profile_image(buffer: Buffer): Promise<Buffer> {
  return await optimize_image(buffer, PROFILE_IMAGE_CONFIG);
}

/**
 * 일반 이미지 최적화 (최대 크기 제한, 비율 유지)
 * 
 * @param buffer - 원본 이미지 버퍼
 * @param max_width - 최대 너비 (기본값: 1920px)
 * @param max_height - 최대 높이 (기본값: 1920px)
 * @returns 최적화된 이미지 버퍼
 */
export async function optimize_general_image(
  buffer: Buffer,
  max_width: number = GENERAL_IMAGE_CONFIG.max_width,
  max_height: number = GENERAL_IMAGE_CONFIG.max_height
): Promise<Buffer> {
  return await optimize_image(buffer, {
    max_width,
    max_height,
    quality: GENERAL_IMAGE_CONFIG.quality,
    format: GENERAL_IMAGE_CONFIG.format,
  });
}

/**
 * 파일명에서 확장자를 추출하고 최적화된 포맷의 확장자로 변경
 * 
 * @param original_filename - 원본 파일명
 * @param target_format - 변환할 포맷 (기본값: 'webp')
 * @returns 새로운 파일명
 */
export function get_optimized_filename(
  original_filename: string,
  target_format: 'webp' | 'jpeg' | 'png' = 'webp'
): string {
  const last_dot_index = original_filename.lastIndexOf('.');
  const base_name = last_dot_index > 0 
    ? original_filename.substring(0, last_dot_index) 
    : original_filename;
  
  return `${base_name}.${target_format}`;
}

