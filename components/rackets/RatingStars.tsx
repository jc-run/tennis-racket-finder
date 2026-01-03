// 평점 별표 컴포넌트
// 평점을 별표로 표시하는 컴포넌트

interface RatingStarsProps {
  rating: number; // 0~5
  size?: 'sm' | 'md' | 'lg';
  show_number?: boolean;
}

/**
 * RatingStars 컴포넌트
 * 
 * @param rating - 평점 (0~5)
 * @param size - 별표 크기
 * @param show_number - 평점 숫자 표시 여부
 */
export default function RatingStars({
  rating,
  size = 'md',
  show_number = false,
}: RatingStarsProps) {
  const size_classes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const size_class = size_classes[size];
  const full_stars = Math.floor(rating);
  const has_half_star = rating % 1 >= 0.5;
  const empty_stars = 5 - full_stars - (has_half_star ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {/* 별표 */}
      <div className="flex items-center">
        {/* 채워진 별 */}
        {Array.from({ length: full_stars }).map((_, i) => (
          <svg
            key={`full-${i}`}
            className={`${size_class} text-yellow-400`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}

        {/* 반 별 */}
        {has_half_star && (
          <svg
            className={`${size_class} text-yellow-400`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id="half-fill">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              fill="url(#half-fill)"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        )}

        {/* 빈 별 */}
        {Array.from({ length: empty_stars }).map((_, i) => (
          <svg
            key={`empty-${i}`}
            className={`${size_class} text-gray-300`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* 평점 숫자 */}
      {show_number && (
        <span className="ml-2 text-gray-700 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

