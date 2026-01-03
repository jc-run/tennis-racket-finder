// 이미지 검증 유틸리티
// 업로드 전 이미지 파일의 유효성을 검증

import sharp from 'sharp';

// 허용되는 이미지 MIME 타입
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

// 허용되는 이미지 확장자
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// 최대 파일 크기 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// 최소 이미지 크기 (100x100px)
const MIN_IMAGE_SIZE = 100;

// 최대 이미지 크기 (4000x4000px)
const MAX_IMAGE_SIZE = 4000;

/**
 * 파일의 MIME 타입이 허용되는지 확인
 * 
 * @param mime_type - 검증할 MIME 타입
 * @returns 허용 여부
 */
export function is_allowed_mime_type(mime_type: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mime_type.toLowerCase());
}

/**
 * 파일 확장자가 허용되는지 확인
 * 
 * @param filename - 파일명
 * @returns 허용 여부
 */
export function is_allowed_extension(filename: string): boolean {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return ALLOWED_EXTENSIONS.includes(extension);
}

/**
 * 파일 크기가 제한 내인지 확인
 * 
 * @param file_size - 파일 크기 (바이트)
 * @returns 제한 내 여부
 */
export function is_valid_file_size(file_size: number): boolean {
  return file_size > 0 && file_size <= MAX_FILE_SIZE;
}

/**
 * 이미지 파일을 검증하고 메타데이터를 반환
 * 
 * @param buffer - 이미지 파일 버퍼
 * @returns 검증 결과 및 메타데이터
 */
export async function validate_image(
  buffer: Buffer
): Promise<{
  is_valid: boolean;
  error?: string;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}> {
  try {
    // Sharp를 사용하여 이미지 메타데이터 가져오기
    const metadata = await sharp(buffer).metadata();

    // 이미지인지 확인 (width, height가 있어야 함)
    if (!metadata.width || !metadata.height) {
      return {
        is_valid: false,
        error: '유효한 이미지 파일이 아닙니다.',
      };
    }

    // 최소 크기 확인
    if (metadata.width < MIN_IMAGE_SIZE || metadata.height < MIN_IMAGE_SIZE) {
      return {
        is_valid: false,
        error: `이미지는 최소 ${MIN_IMAGE_SIZE}x${MIN_IMAGE_SIZE}px 이상이어야 합니다.`,
      };
    }

    // 최대 크기 확인
    if (metadata.width > MAX_IMAGE_SIZE || metadata.height > MAX_IMAGE_SIZE) {
      return {
        is_valid: false,
        error: `이미지는 최대 ${MAX_IMAGE_SIZE}x${MAX_IMAGE_SIZE}px 이하여야 합니다.`,
      };
    }

    // 포맷 확인
    if (!metadata.format || !ALLOWED_EXTENSIONS.includes(`.${metadata.format}`)) {
      return {
        is_valid: false,
        error: '지원하지 않는 이미지 포맷입니다. (JPG, PNG, WEBP, GIF만 지원)',
      };
    }

    return {
      is_valid: true,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: buffer.length,
      },
    };
  } catch (error) {
    console.error('이미지 검증 오류:', error);
    return {
      is_valid: false,
      error: '이미지 파일을 읽을 수 없습니다.',
    };
  }
}

/**
 * 업로드된 파일의 전체 검증 수행
 * 
 * @param file - 검증할 파일 (File 객체 또는 FormData File)
 * @returns 검증 결과
 */
export async function validate_uploaded_file(
  file: File
): Promise<{
  is_valid: boolean;
  error?: string;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}> {
  // MIME 타입 검증
  if (!is_allowed_mime_type(file.type)) {
    return {
      is_valid: false,
      error: '지원하지 않는 파일 형식입니다. (JPG, PNG, WEBP, GIF만 지원)',
    };
  }

  // 파일 확장자 검증
  if (!is_allowed_extension(file.name)) {
    return {
      is_valid: false,
      error: '지원하지 않는 파일 확장자입니다.',
    };
  }

  // 파일 크기 검증
  if (!is_valid_file_size(file.size)) {
    return {
      is_valid: false,
      error: `파일 크기는 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB 이하여야 합니다.`,
    };
  }

  // 파일을 버퍼로 변환
  const array_buffer = await file.arrayBuffer();
  const buffer = Buffer.from(array_buffer);

  // 이미지 메타데이터 검증
  return await validate_image(buffer);
}

