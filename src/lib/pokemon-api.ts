// 포켓몬 타입 정의
export interface Pokemon {
    id: number;
    name: string;
    types: {
      type: {
        name: string;
      };
    }[];
    sprites: {
      other: {
        'official-artwork': {
          front_default: string;
        };
      };
    };
    stats: {
      base_stat: number;
      stat: {
        name: string;
      };
    }[];
    abilities: {
      ability: {
        name: string;
      };
      is_hidden: boolean;
    }[];
  }
  
  // 포켓몬 리스트 아이템 타입
  export interface PokemonListItem {
    name: string;
    url: string;
  }
  
  // 포켓몬 리스트 응답 타입
  export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
  }
  
  // 캐시 객체
  const cache: Record<string, any> = {};
  
  // 모든 포켓몬 목록 가져오기
  export async function getAllPokemon(limit = 1000): Promise<PokemonListItem[]> {
    const cacheKey = `pokemon-list-${limit}`;
    
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }
    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    const data: PokemonListResponse = await response.json();
    
    cache[cacheKey] = data.results;
    return data.results;
  }
  
  // 포켓몬 상세 정보 가져오기
  export async function getPokemonDetails(idOrName: string | number): Promise<Pokemon> {
    const cacheKey = `pokemon-${idOrName}`;
    
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }
    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
    const data: Pokemon = await response.json();
    
    cache[cacheKey] = data;
    return data;
  }
  
  // 타입 유효성 데이터 가져오기
  export async function getTypeEffectiveness(type: string) {
    const cacheKey = `type-${type}`;
    
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }
    
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();
    
    cache[cacheKey] = data;
    return data;
  }