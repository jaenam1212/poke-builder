// app/pokedex/[id]/components/PokemonTypeChips.tsx
'use client';

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-green-600',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

export default function PokemonTypeChips({ types }: { types: string[] }) {
  return (
    <div className="flex gap-2">
      {types.map((type) => (
        <span
          key={type}
          className={`${typeColors[type] || 'bg-gray-400'} text-white px-3 py-1 rounded-full text-sm capitalize`}
        >
          {type}
        </span>
      ))}
    </div>
  );
}