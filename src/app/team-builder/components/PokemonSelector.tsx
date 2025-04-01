// app/team-builder/components/PokemonSelector.tsx
'use client';

import { useMemo, useState } from 'react';

import { PokemonListItem } from '@/lib/pokemon-api';

interface PokemonSelectorProps {
  pokemonList: PokemonListItem[];
  onSelect: (pokemon: PokemonListItem) => void;
  disabled?: boolean;
}

export default function PokemonSelector({ 
  pokemonList, 
  onSelect,
  disabled = false 
}: PokemonSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 포켓몬 ID 추출 함수
  const getPokemonId = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 2];
  };
  
  // 검색어에 따라 필터링된 포켓몬 목록
  const filteredPokemon = useMemo(() => {
    return pokemonList.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pokemonList, searchTerm]);
  
  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="포켓몬 이름 검색..."
          className="w-full p-3 border border-gray-300 rounded shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {filteredPokemon.length > 0 ? (
            filteredPokemon.map((pokemon) => {
              const id = getPokemonId(pokemon.url);
              
              return (
                <div 
                  key={pokemon.name}
                  className="flex items-center p-3 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => !disabled && onSelect(pokemon)}
                >
                  <img 
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                    alt={pokemon.name}
                    className="w-12 h-12 mr-4"
                  />
                  <div>
                    <p className="text-gray-500 text-sm">#{id}</p>
                    <h3 className="font-medium capitalize">{pokemon.name}</h3>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500">
              검색 결과가 없습니다
            </div>
          )}
        </div>
      </div>
      
      {disabled && (
        <p className="mt-2 text-red-500 text-sm">
          최대 6마리까지만 선택할 수 있습니다
        </p>
      )}
    </div>
  );
}