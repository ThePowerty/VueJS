export interface Character {
  name: string;
  lastName: string;
  id: number;
}

export const EmptyCharacter: Character = {
  name: '',
  lastName: '',
  id: 0,
}
