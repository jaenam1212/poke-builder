// app/team-builder/page.tsx
import { getAllPokemon, getPokemonDetails } from '@/lib/pokemon-api';

import TeamBuilder from '@/components/shared/TeamBuilder';

export default async function TeamBuilderPage({ 
  searchParams 
}: { 
  searchParams: { add?: string } 
}) {
  const pokemonList = await getAllPokemon(151);
  
  // URL 파라미터로 추가할 포켓몬 ID가 전달되었는지 확인
  let initialPokemon = undefined;
  if (searchParams.add) {
    try {
      initialPokemon = await getPokemonDetails(searchParams.add);
    } catch (error) {
      console.error('Failed to fetch initial Pokemon:', error);
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">포켓몬 팀 빌더</h1>
      <TeamBuilder 
        pokemonList={pokemonList} 
        initialPokemon={initialPokemon}
      />
    </div>
  );
}