// 라켓 이미지 컴포넌트
// 라켓 이미지를 표시하는 컴포넌트

import Image from 'next/image';
import type { Racket } from '@/types/racket';

interface RacketImageProps {
  racket: Racket;
}

/**
 * RacketImage 컴포넌트
 * 
 * @param racket - 라켓 정보
 */
export default function RacketImage({ racket }: RacketImageProps) {
  return (
    <div className="relative w-full h-96 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
      {racket.image_url ? (
        <Image
          src={racket.image_url}
          alt={racket.name}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
          priority
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <svg
              className="w-24 h-24 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500">이미지 없음</p>
          </div>
        </div>
      )}
    </div>
  );
}

