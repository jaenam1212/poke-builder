// app/team-builder/components/TeamBuilder.tsx
'use client';

import { Pokemon, PokemonListItem, getPokemonDetails } from '@/lib/pokemon-api';
import { useEffect, useState } from 'react';

import PokemonSelector from './PokemonSelector';
import RecommendationPanel from './RecommendationPanel';
import TeamDisplay from './TeamDisplay';

interface TeamBuilderProps {
  pokemonList: PokemonListItem[];
  initialPokemon?: Pokemon;
}

export default function TeamBuilder({ 
  pokemonList,
  initialPokemon
}: TeamBuilderProps) {
  // 선택된 포켓몬 (최대 6마리)
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon[]>([]);
  
  // 초기 포켓몬이 제공되면 팀에 추가
  useEffect(() => {
    if (initialPokemon && !selectedPokemon.find(p => p.id === initialPokemon.id)) {
      setSelectedPokemon(prev => [...prev, initialPokemon]);
    }
  }, [initialPokemon]);
  
  // 포켓몬 추가
  const addPokemon = async (pokemon: PokemonListItem) => {
    if (selectedPokemon.length >= 6) return;
    
    try {
      // URL에서 ID 추출
      const url = pokemon.url;
      const parts = url.split('/');
      const id = parts[parts.length - 2];
      
      // 이미 선택된 포켓몬인지 확인
      if (selectedPokemon.find(p => p.id.toString() === id)) return;
      
      // 포켓몬 상세 정보 가져오기
      const details = await getPokemonDetails(id);
      setSelectedPokemon(prev => [...prev, details]);
    } catch (error) {
      console.error('Failed to add Pokemon:', error);
    }
  };
  
  // 포켓몬 제거
  const removePokemon = (id: number) => {
    setSelectedPokemon(prev => prev.filter(p => p.id !== id));
  };
  
  // 추천 요청 가능 여부 확인
  const canRequestRecommendations = selectedPokemon.length >= 2 && selectedPokemon.length <= 3;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">나의 포켓몬 팀</h2>
        <TeamDisplay 
          team={selectedPokemon} 
          onRemove={removePokemon} 
        />
        
        {canRequestRecommendations && (
          <button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full"
          >
            팀 추천 받기
          </button>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">포켓몬 선택</h2>
        <PokemonSelector 
          pokemonList={pokemonList} 
          onSelect={addPokemon} 
          disabled={selectedPokemon.length >= 6}
        />
      </div>
      
      {/* 추천 패널 (구현 예정) */}
      {canRequestRecommendations && (
        <div className="col-span-1 md:col-span-2 mt-6">
          <RecommendationPanel 
            selectedPokemon={selectedPokemon}
          />
        </div>
      )}
    </div>
  );
}