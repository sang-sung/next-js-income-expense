export interface transactionsType {
  id: number;
  user_id: number;
  date: Date;
  desc: text;
  amount: number;
  type: number;
  cate: number[];
}
