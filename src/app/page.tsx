import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">포켓몬 팀 빌더</h1>
      
      <div className="max-w-2xl text-center mb-8">
        <p className="text-lg text-gray-700 mb-4">
          최적의 포켓몬 팀을 만들어보세요! 2-3마리의 포켓몬을 선택하면 타입과 특성을 고려한 나머지 팀원을 추천해드립니다.
        </p>
        <p className="text-md text-gray-600">
          타입 상성, 특성 시너지, 스탯 밸런스를 고려한 완벽한 팀 구성을 위한 도구입니다.
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {/* 대표 포켓몬 6마리 이미지 */}
        {[1, 4, 7, 25, 133, 150].map((id) => (
          <div key={id} className="w-24 h-24 relative">
            <Image
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
              alt={`포켓몬 #${id}`}
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/team-builder"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          팀 빌더 시작하기
        </Link>
        <Link 
          href="/pokedex"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          포켓몬 도감 보기
        </Link>
      </div>
      
      <div className="mt-16 text-center max-w-xl">
        <h2 className="text-2xl font-semibold mb-4">포켓몬 팀 빌더 특징</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4">
            <div className="text-red-600 text-3xl mb-2">⚡</div>
            <h3 className="font-bold mb-2">타입 분석</h3>
            <p className="text-gray-600">타입 상성을 고려해 최적의 팀을 구성합니다</p>
          </div>
          <div className="p-4">
            <div className="text-red-600 text-3xl mb-2">🛡️</div>
            <h3 className="font-bold mb-2">능력치 밸런스</h3>
            <p className="text-gray-600">균형 잡힌 스탯 분포로 팀을 강화합니다</p>
          </div>
          <div className="p-4">
            <div className="text-red-600 text-3xl mb-2">✨</div>
            <h3 className="font-bold mb-2">특성 시너지</h3>
            <p className="text-gray-600">포켓몬 특성 간의 시너지를 분석합니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}