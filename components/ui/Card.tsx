'use client';

// 재사용 가능한 Card 컴포넌트
// 콘텐츠를 카드 형태로 표시하는 컴포넌트

import React from 'react';

// Card 컴포넌트 Props
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

/**
 * Card 컴포넌트
 * 
 * @param children - 카드 내용
 * @param className - 추가 CSS 클래스
 * @param hover - 호버 효과 여부
 * @param onClick - 클릭 핸들러
 */
function Card({
  children,
  className = '',
  hover = false,
  onClick,
}: CardProps) {
  const base_classes = 'bg-white rounded-lg shadow-md border border-gray-200';
  const hover_classes = hover || onClick ? 'transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
  const combined_classes = `${base_classes} ${hover_classes} ${className}`.trim();

  return (
    <div
      className={combined_classes}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
}

// default export와 named export 모두 지원
export default Card;
export { Card };

// Card Header 컴포넌트
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

// Card Body 컴포넌트
interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

// Card Footer 컴포넌트
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

