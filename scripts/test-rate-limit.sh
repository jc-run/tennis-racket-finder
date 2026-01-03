#!/bin/bash

# Rate Limit 테스트 스크립트
# 리뷰와 댓글 API의 Rate Limiting 동작을 테스트

BASE_URL="${BASE_URL:-http://localhost:3000}"
REVIEW_API="${BASE_URL}/api/reviews"
COMMENT_API="${BASE_URL}/api/comments"

echo "🚀 Rate Limit 테스트 시작"
echo "BASE_URL: $BASE_URL"
echo ""

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 리뷰 작성 Rate Limit 테스트 (1분에 5회)
echo "📝 리뷰 작성 Rate Limit 테스트 (제한: 1분에 5회)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for i in {1..6}; do
  echo -n "요청 $i: "
  
  response=$(curl -s -w "\n%{http_code}" -X POST "$REVIEW_API" \
    -H "Content-Type: application/json" \
    -d '{
      "racket_id": 1,
      "rating": 5,
      "content": "Rate Limit 테스트 리뷰입니다. 이 내용은 충분히 길어야 합니다."
    }')
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
    echo -e "${GREEN}✓ 성공 (${http_code})${NC}"
  elif [ "$http_code" -eq 401 ]; then
    echo -e "${YELLOW}⚠ 인증 필요 (${http_code}) - 로그인 후 테스트하세요${NC}"
  elif [ "$http_code" -eq 429 ]; then
    echo -e "${RED}✗ Rate Limit 초과 (${http_code}) - 정상 동작!${NC}"
    echo "$body" | grep -o '"error":"[^"]*"' || echo "$body"
  else
    echo -e "${RED}✗ 오류 (${http_code})${NC}"
    echo "$body" | grep -o '"error":"[^"]*"' || echo "$body"
  fi
  
  sleep 0.5
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 댓글 작성 Rate Limit 테스트 (1분에 10회)
echo "💬 댓글 작성 Rate Limit 테스트 (제한: 1분에 10회)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for i in {1..11}; do
  echo -n "요청 $i: "
  
  response=$(curl -s -w "\n%{http_code}" -X POST "$COMMENT_API" \
    -H "Content-Type: application/json" \
    -d '{
      "racket_id": 1,
      "content": "Rate Limit 테스트 댓글입니다."
    }')
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
    echo -e "${GREEN}✓ 성공 (${http_code})${NC}"
  elif [ "$http_code" -eq 401 ]; then
    echo -e "${YELLOW}⚠ 인증 필요 (${http_code}) - 로그인 후 테스트하세요${NC}"
  elif [ "$http_code" -eq 429 ]; then
    echo -e "${RED}✗ Rate Limit 초과 (${http_code}) - 정상 동작!${NC}"
    echo "$body" | grep -o '"error":"[^"]*"' || echo "$body"
  else
    echo -e "${RED}✗ 오류 (${http_code})${NC}"
    echo "$body" | grep -o '"error":"[^"]*"' || echo "$body"
  fi
  
  sleep 0.3
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Rate Limit 테스트 완료"
echo ""
echo "💡 참고: 인증이 필요한 경우 로그인 후 쿠키를 포함하여 테스트하세요."
echo "   curl -X POST ... -H 'Cookie: your-session-cookie' ..."

