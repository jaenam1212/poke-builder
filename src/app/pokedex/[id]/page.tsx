import Link from 'next/link';
import PokemonStats from '@/components/shared/PokemonStats';
import PokemonTypeChips from '@/components/shared/PokemonTypeChips';
import { getPokemonDetails } from '@/services/api/pokemon-api';
// app/pokedex/[id]/page.tsx

export default async function PokemonDetailPage({ params }: { params: { id: string } }) {
  const pokemon = await getPokemonDetails(params.id);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/pokedex" className="text-blue-600 hover:underline">
          &larr; 도감으로 돌아가기
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row">
          <div className="flex-shrink-0 flex justify-center md:w-1/3">
            <img
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              className="w-64 h-64 object-contain"
            />
          </div>
          
          <div className="mt-6 md:mt-0 md:ml-8 flex-grow">
            <div className="flex items-baseline">
              <h1 className="text-3xl font-bold capitalize">
                {pokemon.name}
              </h1>
              <p className="ml-4 text-gray-500 text-xl">
                #{pokemon.id.toString().padStart(3, '0')}
              </p>
            </div>
            
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">타입</h2>
              <PokemonTypeChips types={pokemon.types.map(t => t.type.name)} />
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">특성</h2>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability) => (
                  <span 
                    key={ability.ability.name}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm capitalize"
                  >
                    {ability.ability.name.replace('-', ' ')}
                    {ability.is_hidden && <span className="ml-1 text-gray-500">(숨겨진 특성)</span>}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">능력치</h2>
              <PokemonStats stats={pokemon.stats} />
            </div>
            
            <div className="mt-8">
              <Link
                href={`/team-builder?add=${pokemon.id}`}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded inline-block"
              >
                팀에 추가하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}