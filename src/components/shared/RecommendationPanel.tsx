// app/team-builder/components/RecommendationPanel.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';
import { Pokemon } from '@/types/pokemon';
import PokemonTypeChips from '@/components/shared/PokemonTypeChips';
import { getPokemonDetails } from '@/lib/pokemon-api';
import { supabase } from '@/lib/supabase';

interface RecommendationPanelProps {
  selectedPokemon: Pokemon[];
}

interface RecommendedPokemon {
  pokemon: Pokemon;
  reasons: string[];
}

interface RecommendationResponse {
  id: number;
  reasons: string[];
}

export default function RecommendationPanel({ 
  selectedPokemon 
}: RecommendationPanelProps) {
  const [recommendations, setRecommendations] = useState<RecommendedPokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const requestRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/recommend-pokemon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedPokemon: selectedPokemon.map(p => ({
            id: p.id,
            name: p.name,
            types: p.types.map(t => t.type.name),
            stats: p.stats.map(s => ({
              name: s.stat.name,
              value: s.base_stat
            })),
            abilities: p.abilities.map(a => a.ability.name)
          }))
        }),
      });
      
      if (!response.ok) {
        throw new Error('추천을 가져오는데 실패했습니다');
      }
      
      const data = await response.json();
      
      const recommendedPokemonDetails = await Promise.all(
        data.recommendations.map(async (rec: RecommendationResponse) => {
          const pokemon = await getPokemonDetails(rec.id);
          return {
            pokemon,
            reasons: rec.reasons
          };
        })
      );
      
      setRecommendations(recommendedPokemonDetails);
    } catch (error: Error | unknown) {
      console.error('Error fetching recommendations:', error);
      setError(error instanceof Error ? error.message : '추천을 받는 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }, [selectedPokemon]);

  useEffect(() => {
    if (selectedPokemon.length >= 2 && selectedPokemon.length <= 3) {
      requestRecommendations();
    }
  }, [selectedPokemon, requestRecommendations]);
  
  // 팀 저장 함수
  const saveTeam = async (recommendedPokemon: Pokemon[]) => {
    try {
      // 사용자 로그인 확인
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('팀을 저장하려면 로그인이 필요합니다');
        return;
      }
      
      // 새 팀 생성
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: '내 팀',
          user_id: user.id
        })
        .select()
        .single();
      
      if (teamError) throw teamError;
      
      // 선택한 포켓몬과 추천 포켓몬 합치기
      const allPokemon = [...selectedPokemon, ...recommendedPokemon];
      
      // 팀 포켓몬 추가
      const pokemonInserts = allPokemon.map((pokemon, index) => ({
        team_id: team.id,
        pokemon_id: pokemon.id,
        slot: index + 1
      }));
      
      const { error: pokemonError } = await supabase
        .from('team_pokemon')
        .insert(pokemonInserts);
      
      if (pokemonError) throw pokemonError;
      
      alert('팀이 성공적으로 저장되었습니다!');
    } catch (error) {
      console.error('Error saving team:', error);
      alert('팀 저장 중 오류가 발생했습니다');
    }
  };
  
  // 아직 추천 요청하지 않았을 때
  if (recommendations.length === 0 && !loading && !error) {
    return (
      <div className="bg-white rounded-lg shadow border p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">팀 추천</h2>
        <p className="mb-4">
          선택한 포켓몬을 기반으로 최적의 팀 구성을 추천해 드립니다.
          타입 상성, 특성, 스탯 밸런스를 고려합니다.
        </p>
        <button
          onClick={requestRecommendations}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
        >
          추천 받기
        </button>
      </div>
    );
  }
  
  // 로딩 중
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">팀 분석 중...</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="mt-4">최적의 팀 구성을 찾고 있습니다...</p>
      </div>
    );
  }
  
  // 에러 발생
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow border p-6 text-center">
        <h2 className="text-xl font-semibold mb-4 text-red-600">오류 발생</h2>
        <p className="mb-4">{error}</p>
        <button
          onClick={requestRecommendations}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
        >
          다시 시도
        </button>
      </div>
    );
  }
  
  // 추천 결과 표시
  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h2 className="text-xl font-semibold mb-4">추천 포켓몬</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.slice(0, 3).map(({ pokemon, reasons }) => (
          <div key={pokemon.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-col items-center mb-4">
              <Image
                src={pokemon.sprites.other['official-artwork'].front_default}
                alt={pokemon.name}
                width={128}
                height={128}
                className="w-32 h-32 object-contain"
              />
              <h3 className="font-semibold capitalize text-lg mt-2">
                {pokemon.name}
              </h3>
              <div className="mt-2">
                <PokemonTypeChips types={pokemon.types.map(t => t.type.name)} />
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">추천 이유:</h4>
              <ul className="text-sm space-y-1">
                {reasons.map((reason, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => saveTeam(recommendations.slice(0, 3).map(r => r.pokemon))}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg mr-4"
        >
          이 팀 저장하기
        </button>
        
        <button
          onClick={requestRecommendations}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
        >
          다른 추천 받기
        </button>
      </div>
    </div>
  );
}