// Game logic for checkers

export const EMPTY = null

export function initBoard() {
  const board = Array.from({ length: 8 }, () => Array(8).fill(EMPTY))
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) board[r][c] = { color: 'black', king: false }
    }
  }
  for (let r = 5; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) board[r][c] = { color: 'red', king: false }
    }
  }
  return board
}

function cloneBoard(b) {
  return b.map(row => row.map(cell => (cell ? { ...cell } : null)))
}

function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8
}

// Generate moves for a single piece, including multi-captures
function capturesFrom(board, r, c, piece) {
  const dirs = piece.king ? [[1,1],[1,-1],[-1,1],[-1,-1]] : (piece.color === 'red' ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]])
  const results = []

  for (const [dr, dc] of dirs) {
    const midR = r + dr
    const midC = c + dc
    const landingR = r + 2*dr
    const landingC = c + 2*dc
    if (inBounds(landingR, landingC) && inBounds(midR, midC)) {
      const mid = board[midR][midC]
      if (mid && mid.color !== piece.color && !board[landingR][landingC]) {
        // perform capture and look for further captures recursively
        const newBoard = cloneBoard(board)
        newBoard[landingR][landingC] = { ...piece }
        newBoard[r][c] = null
        newBoard[midR][midC] = null
        const after = capturesFrom(newBoard, landingR, landingC, newBoard[landingR][landingC])
        if (after.length === 0) {
          results.push({ moves: [[landingR,landingC]], captures: [[midR,midC]] })
        } else {
          for (const a of after) {
            results.push({ moves: [[landingR,landingC], ...a.moves], captures: [[midR,midC], ...a.captures] })
          }
        }
      }
    }
  }
  return results
}

function simpleMovesFrom(board, r, c, piece) {
  const dirs = piece.king ? [[1,1],[1,-1],[-1,1],[-1,-1]] : (piece.color === 'red' ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]])
  const moves = []
  for (const [dr, dc] of dirs) {
    const nr = r + dr
    const nc = c + dc
    if (inBounds(nr,nc) && !board[nr][nc]) moves.push([nr,nc])
  }
  return moves
}

export function getAllValidMoves(board, playerColor) {
  const captures = []
  const normals = []
  for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
    const piece = board[r][c]
    if (!piece || piece.color !== playerColor) continue
    const caps = capturesFrom(board, r, c, piece)
    if (caps.length) {
      for (const cap of caps) captures.push({ from: [r,c], to: cap.moves, captures: cap.captures })
    } else {
      const moves = simpleMovesFrom(board, r, c, piece)
      for (const to of moves) normals.push({ from: [r,c], to: [to], captures: [] })
    }
  }
  return captures.length ? { forced: true, moves: captures } : { forced: false, moves: normals }
}

export function applyMove(board, move, playerColor) {
  // move: { from: [r,c], to: [[r1,c1],[r2,c2],...], captures: [[rm,cm], ...] }
  const newBoard = cloneBoard(board)
  const [fr, fc] = move.from
  const piece = newBoard[fr][fc]
  newBoard[fr][fc] = null
  const last = move.to[move.to.length-1]
  const [lr, lc] = last
  newBoard[lr][lc] = { ...piece }
  // remove captures
  if (move.captures && move.captures.length) {
    for (const [cr,cc] of move.captures) newBoard[cr][cc] = null
  }
  // promotion
  if (!newBoard[lr][lc].king) {
    if (newBoard[lr][lc].color === 'red' && lr === 0) newBoard[lr][lc].king = true
    if (newBoard[lr][lc].color === 'black' && lr === 7) newBoard[lr][lc].king = true
  }
  return newBoard
}

export function countPieces(board) {
  const res = { red: 0, black: 0 }
  for (const row of board) for (const cell of row) if (cell) res[cell.color]++
  return res
}

export function isGameOver(board, playerColor) {
  // if player has no moves or no pieces -> game over
  const pMoves = getAllValidMoves(board, playerColor)
  const counts = countPieces(board)
  if (counts.red === 0) return { over: true, winner: 'black' }
  if (counts.black === 0) return { over: true, winner: 'red' }
  if (!pMoves.moves.length) return { over: true, winner: playerColor === 'red' ? 'black' : 'red' }
  return { over: false }
}
