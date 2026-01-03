// Rate Limit 테스트 스크립트 (Node.js)
// 리뷰와 댓글 API의 Rate Limiting 동작을 테스트

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const REVIEW_API = `${BASE_URL}/api/reviews`;
const COMMENT_API = `${BASE_URL}/api/comments`;

// 색상 코드
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function testReviewRateLimit() {
  console.log('📝 리뷰 작성 Rate Limit 테스트 (제한: 1분에 5회)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  for (let i = 1; i <= 6; i++) {
    process.stdout.write(`요청 ${i}: `);

    try {
      const response = await fetch(REVIEW_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          racket_id: 1,
          rating: 5,
          content: 'Rate Limit 테스트 리뷰입니다. 이 내용은 충분히 길어야 합니다.',
        }),
      });

      const statusCode = response.status;
      const data = await response.json().catch(() => ({}));

      if (statusCode === 200 || statusCode === 201) {
        console.log(`${colors.green}✓ 성공 (${statusCode})${colors.reset}`);
      } else if (statusCode === 401) {
        console.log(
          `${colors.yellow}⚠ 인증 필요 (${statusCode}) - 로그인 후 테스트하세요${colors.reset}`
        );
      } else if (statusCode === 429) {
        console.log(
          `${colors.red}✗ Rate Limit 초과 (${statusCode}) - 정상 동작!${colors.reset}`
        );
        if (data.error) {
          console.log(`   ${data.error}`);
        }
      } else {
        console.log(`${colors.red}✗ 오류 (${statusCode})${colors.reset}`);
        if (data.error) {
          console.log(`   ${data.error}`);
        }
      }
    } catch (error) {
      console.log(`${colors.red}✗ 네트워크 오류${colors.reset}`);
      console.log(`   ${error.message}`);
    }

    await sleep(500);
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

async function testCommentRateLimit() {
  console.log('💬 댓글 작성 Rate Limit 테스트 (제한: 1분에 10회)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  for (let i = 1; i <= 11; i++) {
    process.stdout.write(`요청 ${i}: `);

    try {
      const response = await fetch(COMMENT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          racket_id: 1,
          content: 'Rate Limit 테스트 댓글입니다.',
        }),
      });

      const statusCode = response.status;
      const data = await response.json().catch(() => ({}));

      if (statusCode === 200 || statusCode === 201) {
        console.log(`${colors.green}✓ 성공 (${statusCode})${colors.reset}`);
      } else if (statusCode === 401) {
        console.log(
          `${colors.yellow}⚠ 인증 필요 (${statusCode}) - 로그인 후 테스트하세요${colors.reset}`
        );
      } else if (statusCode === 429) {
        console.log(
          `${colors.red}✗ Rate Limit 초과 (${statusCode}) - 정상 동작!${colors.reset}`
        );
        if (data.error) {
          console.log(`   ${data.error}`);
        }
      } else {
        console.log(`${colors.red}✗ 오류 (${statusCode})${colors.reset}`);
        if (data.error) {
          console.log(`   ${data.error}`);
        }
      }
    } catch (error) {
      console.log(`${colors.red}✗ 네트워크 오류${colors.reset}`);
      console.log(`   ${error.message}`);
    }

    await sleep(300);
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

async function main() {
  console.log(`${colors.cyan}🚀 Rate Limit 테스트 시작${colors.reset}`);
  console.log(`BASE_URL: ${BASE_URL}\n`);

  await testReviewRateLimit();
  await testCommentRateLimit();

  console.log(`${colors.green}✅ Rate Limit 테스트 완료${colors.reset}\n`);
  console.log(
    `${colors.cyan}💡 참고: 인증이 필요한 경우 로그인 후 쿠키를 포함하여 테스트하세요.${colors.reset}`
  );
}

// Node.js 18 이상에서 fetch 사용 가능
if (typeof fetch === 'undefined') {
  console.error('이 스크립트는 Node.js 18 이상이 필요합니다.');
  console.error('또는 node-fetch 패키지를 설치하세요: npm install node-fetch');
  process.exit(1);
}

main().catch(console.error);

