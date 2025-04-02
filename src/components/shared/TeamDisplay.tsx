// app/team-builder/components/TeamDisplay.tsx
'use client';

import Image from 'next/image';
import { Pokemon } from '@/types/pokemon';
import PokemonTypeChips from '@/components/shared/PokemonTypeChips';

interface TeamDisplayProps {
  team: Pokemon[];
  onRemove: (id: number) => void;
}

export default function TeamDisplay({ team, onRemove }: TeamDisplayProps) {
  // 빈 슬롯 계산
  const emptySlots = 6 - team.length;
  
  return (
    <div className="bg-white rounded-lg shadow border p-4">
      {team.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>포켓몬을 선택하여 팀을 구성하세요</p>
          <p className="text-sm mt-2">추천을 받으려면 2-3마리를 먼저 선택하세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {team.map((pokemon) => (
            <div key={pokemon.id} className="bg-gray-50 rounded p-3 relative">
              <button
                onClick={() => onRemove(pokemon.id)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                aria-label="Remove Pokemon"
              >
                ×
              </button>
              
              <div className="flex flex-col items-center">
                <Image
                  src={pokemon.sprites.other['official-artwork'].front_default}
                  alt={pokemon.name}
                  width={96}
                  height={96}
                  className="object-contain"
                />
                <h3 className="font-medium capitalize text-center mt-2">
                  {pokemon.name}
                </h3>
                <div className="mt-2">
                  <PokemonTypeChips types={pokemon.types.map(t => t.type.name)} />
                </div>
              </div>
            </div>
          ))}
          
          {/* 빈 슬롯 표시 */}
          {Array.from({ length: emptySlots }).map((_, index) => (
            <div 
              key={`empty-${index}`} 
              className="bg-gray-100 rounded p-3 flex items-center justify-center border-2 border-dashed border-gray-300"
            >
              <span className="text-gray-400">빈 슬롯</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}