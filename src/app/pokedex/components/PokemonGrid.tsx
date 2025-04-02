// app/pokedex/components/PokemonGrid.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PokemonListItem } from '@/types/pokemon';
import { useState } from 'react';
interface PokemonGridProps {
  pokemonList: PokemonListItem[];
}

export default function PokemonGrid({ pokemonList }: PokemonGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 포켓몬 ID 추출 함수
  const getPokemonId = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 2];
  };
  
  // 포켓몬 이름 포맷팅
  const formatPokemonName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  
  // 필터링된 포켓몬 목록
  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="포켓몬 이름 검색..."
          className="w-full p-3 border border-gray-300 rounded shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredPokemon.map((pokemon) => {
          const id = getPokemonId(pokemon.url);
          
          return (
            <Link 
              href={`/pokedex/${id}`} 
              key={pokemon.name}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center">
                <Image 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                  alt={pokemon.name}
                  width={128}
                  height={128}
                  className="w-32 h-32 object-contain"
                />
                <div className="mt-2 text-center">
                  <p className="font-bold">#{id}</p>
                  <h2 className="text-lg">{formatPokemonName(pokemon.name)}</h2>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}