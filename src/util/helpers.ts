export type Hand = 'rock' | 'paper' | 'scissors'

export const whoWin = (you: Hand, enemy: Hand): 'win' | 'lose' | 'draw' => {
  if (you === enemy) return 'draw'
  if (
    you === 'paper' && enemy === 'rock' 
    || you === 'rock' && enemy === 'scissors' 
    || you === 'scissors' && enemy === 'paper'
  ) return 'win'
  return 'lose'
}