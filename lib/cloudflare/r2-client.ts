// Cloudflare R2 클라이언트 설정
// S3 호환 API를 사용하여 R2 버킷과 통신

import { S3Client } from '@aws-sdk/client-s3';

/**
 * R2 버킷 설정을 가져옴
 * 환경 변수에서 R2 관련 설정을 읽어옴
 */
function get_r2_config() {
  const account_id = process.env.CLOUDFLARE_ACCOUNT_ID;
  const access_key_id = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secret_access_key = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucket_name = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const public_url = process.env.CLOUDFLARE_R2_PUBLIC_URL; // CDN URL 또는 커스텀 도메인

  if (!account_id || !access_key_id || !secret_access_key || !bucket_name) {
    throw new Error('R2 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
  }

  return {
    account_id,
    access_key_id,
    secret_access_key,
    bucket_name,
    public_url: public_url || `https://pub-${account_id}.r2.dev/${bucket_name}`,
  };
}

/**
 * R2 S3 클라이언트 인스턴스 생성
 * 
 * R2는 S3 호환 API를 제공하므로 @aws-sdk/client-s3를 사용할 수 있음
 * endpoint를 R2의 엔드포인트로 설정
 */
export function create_r2_client(): S3Client {
  const config = get_r2_config();

  return new S3Client({
    region: 'auto', // R2는 region이 'auto'로 고정
    endpoint: `https://${config.account_id}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.access_key_id,
      secretAccessKey: config.secret_access_key,
    },
  });
}

/**
 * R2 버킷 이름을 가져옴
 */
export function get_r2_bucket_name(): string {
  const config = get_r2_config();
  return config.bucket_name;
}

/**
 * 업로드된 파일의 공개 URL을 생성
 * 
 * @param file_path - R2 버킷 내 파일 경로
 * @returns 공개 접근 가능한 URL
 */
export function get_r2_public_url(file_path: string): string {
  const config = get_r2_config();
  // URL 끝에 슬래시가 있으면 제거
  const base_url = config.public_url.endsWith('/') 
    ? config.public_url.slice(0, -1) 
    : config.public_url;
  // 파일 경로 시작에 슬래시가 있으면 제거
  const clean_path = file_path.startsWith('/') ? file_path.slice(1) : file_path;
  
  return `${base_url}/${clean_path}`;
}

