# Rate Limit 테스트 스크립트 (PowerShell)
# 리뷰와 댓글 API의 Rate Limiting 동작을 테스트

$BASE_URL = if ($env:BASE_URL) { $env:BASE_URL } else { "http://localhost:3000" }
$REVIEW_API = "$BASE_URL/api/reviews"
$COMMENT_API = "$BASE_URL/api/comments"

Write-Host "🚀 Rate Limit 테스트 시작" -ForegroundColor Cyan
Write-Host "BASE_URL: $BASE_URL"
Write-Host ""

# 리뷰 작성 Rate Limit 테스트 (1분에 5회)
Write-Host "📝 리뷰 작성 Rate Limit 테스트 (제한: 1분에 5회)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for ($i = 1; $i -le 6; $i++) {
    Write-Host -NoNewline "요청 $i`: "
    
    $body = @{
        racket_id = 1
        rating = 5
        content = "Rate Limit 테스트 리뷰입니다. 이 내용은 충분히 길어야 합니다."
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri $REVIEW_API -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -UseBasicParsing `
            -ErrorAction Stop
        
        $statusCode = $response.StatusCode
        if ($statusCode -eq 200 -or $statusCode -eq 201) {
            Write-Host "✓ 성공 ($statusCode)" -ForegroundColor Green
        } else {
            Write-Host "✗ 오류 ($statusCode)" -ForegroundColor Red
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401) {
            Write-Host "⚠ 인증 필요 ($statusCode) - 로그인 후 테스트하세요" -ForegroundColor Yellow
        } elseif ($statusCode -eq 429) {
            Write-Host "✗ Rate Limit 초과 ($statusCode) - 정상 동작!" -ForegroundColor Red
        } else {
            Write-Host "✗ 오류 ($statusCode)" -ForegroundColor Red
        }
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

# 댓글 작성 Rate Limit 테스트 (1분에 10회)
Write-Host "💬 댓글 작성 Rate Limit 테스트 (제한: 1분에 10회)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for ($i = 1; $i -le 11; $i++) {
    Write-Host -NoNewline "요청 $i`: "
    
    $body = @{
        racket_id = 1
        content = "Rate Limit 테스트 댓글입니다."
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri $COMMENT_API -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -UseBasicParsing `
            -ErrorAction Stop
        
        $statusCode = $response.StatusCode
        if ($statusCode -eq 200 -or $statusCode -eq 201) {
            Write-Host "✓ 성공 ($statusCode)" -ForegroundColor Green
        } else {
            Write-Host "✗ 오류 ($statusCode)" -ForegroundColor Red
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401) {
            Write-Host "⚠ 인증 필요 ($statusCode) - 로그인 후 테스트하세요" -ForegroundColor Yellow
        } elseif ($statusCode -eq 429) {
            Write-Host "✗ Rate Limit 초과 ($statusCode) - 정상 동작!" -ForegroundColor Red
        } else {
            Write-Host "✗ 오류 ($statusCode)" -ForegroundColor Red
        }
    }
    
    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""
Write-Host "✅ Rate Limit 테스트 완료" -ForegroundColor Green
Write-Host ""
Write-Host "💡 참고: 인증이 필요한 경우 로그인 후 쿠키를 포함하여 테스트하세요." -ForegroundColor Cyan

