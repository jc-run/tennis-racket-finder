// Supabase 연결 테스트 페이지
import { supabase } from '@/lib/supabase/client';

export default async function TestSupabasePage() {
  let brands = null;
  let error = null;

  try {
    // 브랜드 데이터 조회
    const { data, error: fetchError } = await supabase
      .from('brands')
      .select('*')
      .order('display_order');

    if (fetchError) {
      error = fetchError;
    } else {
      brands = data;
    }
  } catch (e: any) {
    error = { message: e.message };
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className="min-h-screen p-8 bg-red-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            ❌ Supabase 연결 실패
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">에러 메시지:</h2>
            <p className="text-red-500 font-mono">{error.message}</p>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">확인 사항:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>.env.local 파일이 존재하는지 확인</li>
                <li>환경 변수 값이 올바른지 확인</li>
                <li>Supabase 프로젝트가 활성화되어 있는지 확인</li>
                <li>개발 서버를 재시작해보세요 (npm run dev)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 성공 시
  return (
    <div className="min-h-screen p-8 bg-green-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Supabase 연결 성공!
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">브랜드 목록</h2>
          
          {brands && brands.length > 0 ? (
            <div className="space-y-4">
              {brands.map((brand: any) => (
                <div 
                  key={brand.id} 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{brand.name}</h3>
                      <p className="text-gray-600">Slug: {brand.slug}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      순서: {brand.display_order}
                    </div>
                  </div>
                  {brand.description && (
                    <p className="mt-2 text-gray-700">{brand.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                브랜드 데이터가 없습니다.
              </p>
              <p className="text-sm text-gray-500">
                supabase/sample-data.sql을 실행하여 샘플 데이터를 추가하세요.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">연결 정보</h2>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="font-semibold w-32">Supabase URL:</span>
              <span className="text-gray-600 font-mono">
                {process.env.NEXT_PUBLIC_SUPABASE_URL}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-32">상태:</span>
              <span className="text-green-600 font-semibold">연결됨</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← 홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}

