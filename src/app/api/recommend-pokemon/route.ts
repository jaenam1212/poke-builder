import { getAllPokemon, getPokemonDetails } from '@/lib/pokemon-api';

import { NextResponse } from 'next/server';

type PokemonType = string;

interface PokemonInput {
  id: number;
  name: string;
  types: PokemonType[];
  stats: { name: string; value: number }[];
  abilities: string[];
}

interface TypeEffectiveness {
  [key: string]: number;
}

interface PokemonStat {
  stat: {
    name: string;
  };
  base_stat: number;
}

interface PokemonDetail {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  stats: PokemonStat[];
}

interface TeamAnalysis {
  typeCount: Record<string, number>;
  avgStats: Record<string, number>;
  weaknesses: Record<string, number>;
  resistances: Record<string, number>;
}

// 타입 효과 관계 (매우 간소화된 버전)
const typeEffectiveness: Record<PokemonType, TypeEffectiveness> = {
  normal: { fighting: 2, ghost: 0 },
  fire: { fire: 0.5, water: 2, grass: 0.5, ice: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  water: { fire: 0.5, water: 0.5, grass: 2, electric: 2, ice: 0.5, steel: 0.5 },
  electric: { electric: 0.5, ground: 2, flying: 0.5, steel: 0.5 },
  grass: { fire: 2, water: 0.5, grass: 0.5, poison: 2, ground: 0.5, flying: 2, bug: 2, ice: 2 },
  ice: { fire: 2, ice: 0.5, fighting: 2, rock: 2, steel: 2 },
  fighting: { flying: 2, psychic: 2, bug: 0.5, rock: 0.5, dark: 0.5 },
  poison: { grass: 0.5, poison: 0.5, ground: 2, psychic: 2, bug: 0.5 },
  ground: { water: 2, grass: 2, electric: 0, poison: 0.5, rock: 0.5, ice: 2 },
  flying: { electric: 2, grass: 0.5, ice: 2, fighting: 0.5, ground: 0, bug: 0.5, rock: 2 },
  psychic: { fighting: 0.5, psychic: 0.5, bug: 2, ghost: 2, dark: 2 },
  bug: { fire: 2, grass: 0.5, fighting: 0.5, poison: 0.5, flying: 2, rock: 2 },
  rock: { normal: 0.5, fire: 0.5, water: 2, grass: 2, fighting: 2, poison: 0.5, ground: 2, steel: 2 },
  ghost: { normal: 0, fighting: 0, poison: 0.5, bug: 0.5, ghost: 2, dark: 2 },
  dragon: { dragon: 2, ice: 2, fairy: 2 },
  dark: { fighting: 2, psychic: 0, bug: 2, ghost: 0.5, dark: 0.5, fairy: 2 },
  steel: { fire: 2, water: 0.5, electric: 0.5, ice: 0.5, rock: 0.5, steel: 0.5, fairy: 0.5 },
  fairy: { fighting: 0.5, poison: 2, bug: 0.5, dragon: 0, dark: 0.5, steel: 2 }
};

export async function POST(request: Request) {
  try {
    const { selectedPokemon } = await request.json() as { selectedPokemon: PokemonInput[] };

    if (!selectedPokemon || !Array.isArray(selectedPokemon) || selectedPokemon.length < 2) {
      return NextResponse.json({ error: '최소 2마리의 포켓몬이 필요합니다' }, { status: 400 });
    }

    // 1. 팀 분석: 타입 커버리지, 약점, 스탯 등 분석
    const teamAnalysis = analyzeTeam(selectedPokemon);

    // 2. 후보 포켓몬 목록 가져오기 (간단히 151마리 제한)
    const allPokemon = await getAllPokemon(151);
    
    // 3. 이미 선택된 포켓몬 제외
    const selectedIds = selectedPokemon.map(p => p.id);
    const candidatePokemonURLs = allPokemon.filter(p => {
      const id = extractIdFromUrl(p.url);
      return !selectedIds.includes(parseInt(id));
    });

    // 4. 후보 포켓몬 상세 정보 가져오기 (속도를 위해 최대 20개로 제한)
    const candidateDetails = await Promise.all(
      candidatePokemonURLs.slice(0, 20).map(async p => {
        const id = extractIdFromUrl(p.url);
        return await getPokemonDetails(id);
      })
    );

    // 5. 후보 포켓몬 점수 계산
    const scoredCandidates = candidateDetails.map(pokemon => {
      const score = calculateCompatibilityScore(pokemon, teamAnalysis);
      const reasons = generateRecommendationReasons(pokemon, teamAnalysis);
      
      return {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map(t => t.type.name),
        score,
        reasons
      };
    });

    // 6. 점수 기준으로 정렬하고 상위 결과 반환
    const recommendations = scoredCandidates
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error in recommendation API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 팀 분석 함수
function analyzeTeam(pokemon: PokemonInput[]) {
  // 현재 팀의 타입 목록
  const teamTypes = pokemon.flatMap(p => p.types);
  
  // 타입별 포켓몬 수
  const typeCount: Record<string, number> = {};
  teamTypes.forEach(type => {
    typeCount[type] = (typeCount[type] || 0) + 1;
  });
  
  // 현재 팀의 평균 스탯
  const avgStats: Record<string, number> = {};
  const statFields = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
  
  statFields.forEach(stat => {
    const total = pokemon.reduce((sum, p) => {
      const statObj = p.stats.find(s => s.name === stat);
      return sum + (statObj ? statObj.value : 0);
    }, 0);
    
    avgStats[stat] = total / pokemon.length;
  });
  
  // 타입별 약점 계산
  const weaknesses: Record<string, number> = {};
  const resistances: Record<string, number> = {};
  
  Object.keys(typeEffectiveness).forEach(attackType => {
    // 모든 타입에 대한 데미지 배율 계산
    let totalDamageMultiplier = 1;
    
    teamTypes.forEach(defenseType => {
      if (typeEffectiveness[attackType][defenseType]) {
        totalDamageMultiplier *= typeEffectiveness[attackType][defenseType];
      }
    });
    
    // 평균 배율로 약점/저항성 저장
    const avgMultiplier = totalDamageMultiplier / teamTypes.length;
    
    if (avgMultiplier > 1) {
      weaknesses[attackType] = avgMultiplier;
    } else if (avgMultiplier < 1) {
      resistances[attackType] = avgMultiplier;
    }
  });
  
  return {
    typeCount,
    avgStats,
    weaknesses,
    resistances
  };
}

// 호환성 점수 계산 함수
function calculateCompatibilityScore(pokemon: PokemonDetail, teamAnalysis: TeamAnalysis) {
  let score = 0;
  const pokemonTypes = pokemon.types.map(t => t.type.name);
  
  // 1. 타입 다양성 점수 (팀에 없는 타입)
  pokemonTypes.forEach((type: string) => {
    if (!teamAnalysis.typeCount[type]) {
      score += 10; // 새로운 타입은 높은 점수
    } else {
      score -= teamAnalysis.typeCount[type] * 5; // 중복 타입은 감점
    }
  });
  
  // 2. 약점 보완 점수
  Object.entries(teamAnalysis.weaknesses).forEach(([type, multiplier]) => {
    if (pokemonTypes.some((t: PokemonType) => {
      return typeEffectiveness[type as PokemonType][t] && typeEffectiveness[type as PokemonType][t] < 1;
    })) {
      score += 15 * (Number(multiplier) - 1); // 약점을 보완할수록 높은 점수
    }
  });
  
  // 3. 스탯 밸런스 점수
  const lowStats = Object.entries(teamAnalysis.avgStats)
    .filter(([, value]) => (value as number) < 70) // 낮은 스탯 기준
    .map(([stat]) => stat);
  
  pokemon.stats.forEach((stat: PokemonStat) => {
    if (lowStats.includes(stat.stat.name) && stat.base_stat > 80) {
      score += 5; // 팀의 약점을 보완하는 높은 스탯
    }
  });
  
  // 4. 특성 가산점 (단순화)
  score += 5;
  
  return score;
}

// 추천 이유 생성 함수
function generateRecommendationReasons(pokemon: PokemonDetail, teamAnalysis: TeamAnalysis) {
  const reasons = [];
  const pokemonTypes = pokemon.types.map(t => t.type.name);
  
  // 타입 다양성 이유
const newTypes: PokemonType[] = pokemonTypes.filter((type: PokemonType) => !teamAnalysis.typeCount[type]);
  if (newTypes.length > 0) {
    reasons.push(`팀에 없는 ${newTypes.join(', ')} 타입을 추가합니다`);
  }
  
  // 약점 보완 이유
  const coveredWeaknesses = Object.entries(teamAnalysis.weaknesses)
    .filter(([type]) => {
    return pokemonTypes.some((t: PokemonType) => 
      typeEffectiveness[type as PokemonType][t] && typeEffectiveness[type as PokemonType][t] < 1
    );
    })
    .map(([type]) => type);
  
  if (coveredWeaknesses.length > 0) {
    reasons.push(`팀의 ${coveredWeaknesses.join(', ')} 타입 약점을 보완합니다`);
  }
  
  // 스탯 보완 이유
  const lowStats = Object.entries(teamAnalysis.avgStats)
    .filter(([, value]) => (value as number) < 70)
    .map(([stat]) => stat);
  
  const highStats = pokemon.stats
    .filter((stat: PokemonStat) => lowStats.includes(stat.stat.name) && stat.base_stat > 80)
    .map((stat: PokemonStat) => {
      const statName = stat.stat.name === 'hp' ? 'HP' :
        stat.stat.name === 'special-attack' ? '특수공격' :
        stat.stat.name === 'special-defense' ? '특수방어' :
        stat.stat.name === 'attack' ? '공격' :
        stat.stat.name === 'defense' ? '방어' : '스피드';
      
      return `${statName}(${stat.base_stat})`;
    });
  
  if (highStats.length > 0) {
    reasons.push(`팀의 낮은 스탯을 보완: ${highStats.join(', ')}`);
  }
  
  // 기본 이유 (항상 최소 하나의 이유 제공)
  if (reasons.length === 0) {
    reasons.push('전반적으로 팀 밸런스를 개선합니다');
  }
  
  return reasons;
}

// URL에서 포켓몬 ID 추출
function extractIdFromUrl(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 2];
}