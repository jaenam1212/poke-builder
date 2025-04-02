// app/pokedex/[id]/components/PokemonStats.tsx
'use client';

interface StatProps {
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

const statNames: Record<string, string> = {
  'hp': 'HP',
  'attack': '공격',
  'defense': '방어',
  'special-attack': '특수공격',
  'special-defense': '특수방어',
  'speed': '스피드'
};

const statColors: Record<string, string> = {
  'hp': 'bg-red-500',
  'attack': 'bg-orange-500',
  'defense': 'bg-yellow-500',
  'special-attack': 'bg-blue-500',
  'special-defense': 'bg-green-500',
  'speed': 'bg-pink-500'
};

export default function PokemonStats({ stats }: StatProps) {
  const maxStat = 255; // 포켓몬 능력치 최대값
  
  return (
    <div className="w-full space-y-2">
      {stats.map((stat) => {
        const percentage = Math.min(100, (stat.base_stat / maxStat) * 100);
        
        return (
          <div key={stat.stat.name} className="w-full">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{statNames[stat.stat.name] || stat.stat.name}</span>
              <span className="text-sm font-medium">{stat.base_stat}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${statColors[stat.stat.name] || 'bg-gray-600'}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}