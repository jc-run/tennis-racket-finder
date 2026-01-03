// 라켓 스펙 컴포넌트
// 라켓의 상세 스펙을 표 형태로 표시하는 컴포넌트

import type { Racket } from '@/types/racket';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

interface RacketSpecsProps {
  racket: Racket;
}

/**
 * RacketSpecs 컴포넌트
 * 
 * @param racket - 라켓 정보
 */
export default function RacketSpecs({ racket }: RacketSpecsProps) {
  // 스펙 데이터 구성
  const specs = [
    { label: '헤드 사이즈', value: racket.head_size_sqin, unit: 'sq.in' },
    { label: '길이', value: racket.length_inch, unit: 'inch' },
    { label: '무게 (언스트렁)', value: racket.weight_unstrung_g, unit: 'g' },
    { label: '무게 (스트렁)', value: racket.weight_strung_g, unit: 'g' },
    { label: '밸런스 타입', value: racket.balance_type, unit: '' },
    { label: '밸런스', value: racket.balance_mm, unit: 'mm' },
    { label: '스윙웨이트', value: racket.swingweight, unit: '' },
    { label: '스트링 패턴', value: racket.string_pattern, unit: '' },
    {
      label: '권장 텐션',
      value:
        racket.tension_min_lbs && racket.tension_max_lbs
          ? `${racket.tension_min_lbs} - ${racket.tension_max_lbs}`
          : racket.tension_min_lbs || racket.tension_max_lbs,
      unit: 'lbs',
    },
    {
      label: '빔 두께',
      value:
        racket.beam_min_mm && racket.beam_mid_mm && racket.beam_max_mm
          ? `${racket.beam_min_mm} / ${racket.beam_mid_mm} / ${racket.beam_max_mm}`
          : racket.beam_min_mm || racket.beam_mid_mm || racket.beam_max_mm,
      unit: 'mm',
    },
    { label: '강성 (RA)', value: racket.stiffness_ra, unit: '' },
    { label: '프레임 형상', value: racket.frame_shape, unit: '' },
    {
      label: '그립 사이즈',
      value: racket.grip_sizes?.join(', '),
      unit: '',
    },
    { label: '소재', value: racket.material, unit: '' },
    { label: '기술', value: racket.technology, unit: '' },
    { label: '추천 플레이어 레벨', value: racket.player_level, unit: '' },
  ];

  // 값이 있는 스펙만 필터링
  const available_specs = specs.filter(
    (spec) => spec.value !== null && spec.value !== undefined && spec.value !== ''
  );

  if (available_specs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-gray-900">스펙</h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500">스펙 정보가 없습니다.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">상세 스펙</h2>
      </CardHeader>
      <CardBody>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              {available_specs.map((spec, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700 w-1/3">
                    {spec.label}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {spec.value}
                    {spec.unit && (
                      <span className="ml-2 text-gray-500 text-sm">
                        {spec.unit}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}

