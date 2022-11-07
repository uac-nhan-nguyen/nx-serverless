export interface TodoModel {
  PK: `Todo#${string}`;
  SK: `${string}`
  id: string;
  title: string;
  completed: boolean;
}

