import React, { useEffect, useState, useRef } from 'react'
import Board from './components/Board'
import Controls from './components/Controls'
import { initBoard, getAllValidMoves, applyMove, countPieces, isGameOver } from './game/logic'
import { getAIMove } from './ai/ai'

const LEVELS = ['easy','medium','hard','expert']

export default function App(){
  const [board, setBoard] = useState(initBoard())
  const [turn, setTurn] = useState('red')
  const [selected, setSelected] = useState(null)
  const [highlights, setHighlights] = useState([])
  const [history, setHistory] = useState([])
  const [aiLevel, setAiLevel] = useState('medium')
  const [aiPlays, setAiPlays] = useState('black')
  const [status, setStatus] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState(null)
  const aiThinking = useRef(false)

  useEffect(()=>{
    const check = isGameOver(board, turn)
    if (check.over) {
      setGameOver(true)
      setWinner(check.winner || null)
      setStatus(check.winner ? `${check.winner} wins` : 'Game over')
    } else {
      setGameOver(false)
      setWinner(null)
      setStatus('')
    }
  },[board,turn])

  useEffect(()=>{
    // if it's AI's turn, request move
    if (aiPlays === turn && !aiThinking.current) {
      aiThinking.current = true
      setTimeout(async ()=>{
        const move = await getAIMove(board, turn, aiLevel)
        if (move) doMove(move)
        aiThinking.current = false
      }, 250)
    }
  },[board,turn,aiPlays,aiLevel])

  function startNew() {
    setBoard(initBoard())
    setTurn('red')
    setSelected(null)
    setHighlights([])
    setHistory([])
    setStatus('')
  }

  function onSquareClick(r,c){
    const cell = board[r][c]
    // if selecting own piece
    if (cell && cell.color === turn && aiPlays !== turn) {
      setSelected([r,c])
      // show possible moves from here
      const all = getAllValidMoves(board, turn)
      const moves = all.moves.filter(m => m.from[0]===r && m.from[1]===c)
      const to = moves.flatMap(m => m.to.map(t=>t))
      setHighlights(to)
      return
    }
    // if a piece selected and user clicked a highlighted destination
    if (selected) {
      const all = getAllValidMoves(board, turn)
      const moves = all.moves.filter(m => m.from[0]===selected[0] && m.from[1]===selected[1])
      // match chosen to move
      const chosen = moves.find(m => m.to.some(t => t[0]===r && t[1]===c))
      if (chosen) {
        doMove(chosen)
      }
      setSelected(null)
      setHighlights([])
    }
  }

  function doMove(move){
    const newBoard = applyMove(board, move, turn)
    setHistory(h => [...h, { board, turn, move }])
    setBoard(newBoard)
    setTurn(t => t === 'red' ? 'black' : 'red')
  }

  function undo(){
    setHistory(h => {
      if (!h.length) return h
      const last = h[h.length-1]
      setBoard(last.board)
      setTurn(last.turn)
      return h.slice(0,-1)
    })
  }

  const pieces = countPieces(board)

  return (
    <div className="min-h-screen flex items-start justify-center p-8">
      {gameOver ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white rounded-2xl p-8 w-96 shadow-2xl transform transition-transform scale-100">
            <div className="text-center">
              <div className="text-4xl font-extrabold mb-2">{winner ? (winner === 'red' ? 'Victoire — Rouge !' : 'Victoire — Noir !') : 'Fin de la partie'}</div>
              <div className="mb-4 text-sm opacity-90">{winner ? `Le joueur ${winner} a remporté la partie.` : 'La partie est terminée.'}</div>
              <div className="flex justify-center gap-3">
                <button onClick={startNew} className="px-4 py-2 bg-white text-indigo-700 rounded-md font-semibold">Nouvelle partie</button>
                <button onClick={()=>{ setGameOver(false); setStatus(''); }} className="px-4 py-2 border border-white/30 rounded-md">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Dames — React</h1>
          <div className="space-x-2">
            <button className="px-3 py-1 bg-indigo-600 rounded" onClick={startNew}>Nouvelle partie</button>
            <button className="px-3 py-1 bg-gray-700 rounded" onClick={undo}>Annuler</button>
          </div>
        </div>

        <div className="flex gap-6">
          <div>
            <Board board={board} onSquareClick={onSquareClick} selected={selected} highlights={highlights} />
          </div>
          <div className="w-80 text-sm">
            <div className="mb-4 p-4 bg-gray-800 rounded">
              <div><strong>Joueur courant:</strong> <span className={`font-medium ${turn==='red'?'text-red-400':'text-gray-200'}`}>{turn}</span></div>
              <div className="mt-2"><strong>Score:</strong></div>
              <div className="flex gap-3 mt-1"><div className="px-2 py-1 bg-red-600 rounded">Rouge: {pieces.red}</div><div className="px-2 py-1 bg-gray-700 rounded">Noir: {pieces.black}</div></div>
              <div className="mt-3"><strong>Statut:</strong> {status || 'En cours'}</div>
            </div>

            <Controls aiPlays={aiPlays} setAiPlays={setAiPlays} aiLevel={aiLevel} setAiLevel={setAiLevel} startNew={startNew} undo={undo} levels={LEVELS} />

            <div className="p-4 bg-gray-800 rounded h-64 overflow-auto">
              <div className="mb-2"><strong>Historique des coups</strong></div>
              <ol className="list-decimal list-inside">
                {history.map((h,i)=> (
                  <li key={i}>Tour {i+1}: {h.turn} — {h.move.from.join(',')} → {h.move.to.map(t=>`(${t.join(',')})`).join(' ')} </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
