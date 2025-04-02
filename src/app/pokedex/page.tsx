import Link from 'next/link';
import PokemonGrid from '@/app/pokedex/components/PokemonGrid';
// app/pokedex/page.tsx
import { getAllPokemon } from '@/services/api/pokemon-api';

export default async function PokedexPage() {
  const pokemonList = await getAllPokemon(151); // 첫 151마리 포켓몬 (1세대)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">포켓몬 도감</h1>
        <Link 
          href="/team-builder" 
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          팀 빌더로 이동
        </Link>
      </div>
      
      <PokemonGrid pokemonList={pokemonList} />
    </div>
  );
}