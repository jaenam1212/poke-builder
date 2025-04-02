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

// 팀 분석 관련 타입
export interface TeamAnalysis {
  typeCount: Record<string, number>;
  avgStats: Record<string, number>;
  weaknesses: Record<string, number>;
  resistances: Record<string, number>;
}

export type PokemonType = string;

export interface TypeEffectiveness {
  [key: string]: number;
} 