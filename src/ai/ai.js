import { getAllValidMoves, applyMove, countPieces } from '../game/logic'

function randomMove(board, player) {
  const all = getAllValidMoves(board, player).moves
  if (!all.length) return null
  const m = all[Math.floor(Math.random() * all.length)]
  // normalize single/multi move shape
  return { ...m }
}

function evaluateBoard(board, player) {
  const counts = countPieces(board)
  // simple heuristic: piece count + king bonus
  let score = (counts[player] || 0) - (counts[player === 'red' ? 'black' : 'red'] || 0)
  // add more for kings
  for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
    const p = board[r][c]
    if (!p) continue
    const v = p.king ? 1.6 : 1
    score += (p.color === player ? v : -v)
    // encourage center control
    if (p.color === player && r>=2 && r<=5 && c>=2 && c<=5) score += 0.1
  }
  return score
}

function pickBestHeuristic(board, player) {
  const all = getAllValidMoves(board, player).moves
  if (!all.length) return null
  // prefer captures
  const caps = all.filter(m => m.captures && m.captures.length)
  if (caps.length) return caps[Math.floor(Math.random()*caps.length)]
  // else pick move that advances pawns or protects (naive)
  const scored = all.map(m => {
    const to = m.to[m.to.length-1]
    const score = player === 'red' ? (8 - to[0]) : to[0]
    return { m, score }
  })
  scored.sort((a,b)=>b.score-a.score)
  return scored[0].m
}

function minimax(board, player, depth, maximizingPlayer, originalPlayer) {
  if (depth === 0) return { score: evaluateBoard(board, originalPlayer) }
  const movesObj = getAllValidMoves(board, player)
  const moves = movesObj.moves
  if (!moves.length) return { score: evaluateBoard(board, originalPlayer) }
  let bestMove = null
  if (maximizingPlayer) {
    let best = -Infinity
    for (const m of moves) {
      const newBoard = applyMove(board, m, player)
      const next = minimax(newBoard, player === 'red' ? 'black' : 'red', depth-1, false, originalPlayer)
      if (next.score > best) { best = next.score; bestMove = m }
    }
    return { score: best, move: bestMove }
  } else {
    let best = Infinity
    for (const m of moves) {
      const newBoard = applyMove(board, m, player)
      const next = minimax(newBoard, player === 'red' ? 'black' : 'red', depth-1, true, originalPlayer)
      if (next.score < best) { best = next.score; bestMove = m }
    }
    return { score: best, move: bestMove }
  }
}

function minimaxAB(board, player, depth, alpha, beta, maximizingPlayer, originalPlayer) {
  if (depth === 0) return { score: evaluateBoard(board, originalPlayer) }
  const moves = getAllValidMoves(board, player).moves
  if (!moves.length) return { score: evaluateBoard(board, originalPlayer) }
  let bestMove = null
  if (maximizingPlayer) {
    let value = -Infinity
    for (const m of moves) {
      const nb = applyMove(board, m, player)
      const res = minimaxAB(nb, player === 'red' ? 'black' : 'red', depth-1, alpha, beta, false, originalPlayer)
      if (res.score > value) { value = res.score; bestMove = m }
      alpha = Math.max(alpha, value)
      if (alpha >= beta) break
    }
    return { score: value, move: bestMove }
  } else {
    let value = Infinity
    for (const m of moves) {
      const nb = applyMove(board, m, player)
      const res = minimaxAB(nb, player === 'red' ? 'black' : 'red', depth-1, alpha, beta, true, originalPlayer)
      if (res.score < value) { value = res.score; bestMove = m }
      beta = Math.min(beta, value)
      if (alpha >= beta) break
    }
    return { score: value, move: bestMove }
  }
}

export async function getAIMove(board, player, level = 'easy') {
  // return move object compatible with applyMove
  if (level === 'easy') return randomMove(board, player)
  if (level === 'medium') return pickBestHeuristic(board, player)
  if (level === 'hard') {
    const res = minimax(board, player, 4, true, player)
    return res.move
  }
  if (level === 'expert') {
    const res = minimaxAB(board, player, 6, -Infinity, Infinity, true, player)
    return res.move
  }
  return randomMove(board, player)
}
