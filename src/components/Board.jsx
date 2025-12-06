import React from 'react'

export default function Board({ board, onSelect, selected, highlights, onSquareClick }) {
  return (
    <div className="board relative grid grid-cols-8 gap-0 border-4 border-gray-700">
      {board.map((row, r) => row.map((cell, c) => {
        const isDark = (r + c) % 2 === 1
        const bg = isDark ? 'bg-gray-800' : 'bg-gray-200'
        const isSelected = selected && selected[0] === r && selected[1] === c
        const isHighlighted = highlights && highlights.some(h => h[0] === r && h[1] === c)
        return (
          <div key={`${r}-${c}`} className={`square flex items-center justify-center ${bg} ${isSelected ? 'ring-4 ring-indigo-400' : ''}`} onClick={() => onSquareClick(r,c)}>
            {isHighlighted ? <div className="w-3 h-3 bg-indigo-400 rounded-full" /> : null}
            {cell ? (
              <div className={`piece w-10 h-10 rounded-full flex items-center justify-center transform transition-transform duration-300 ${cell.color === 'red' ? 'bg-red-500' : 'bg-black'} ${cell.king ? 'piece-king' : ''}`}>
                {cell.king ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="gold" strokeWidth="2"><path d="M12 2 L15 8 L22 9 L17 14 L18 22 L12 18 L6 22 L7 14 L2 9 L9 8 Z"/></svg> : null}
              </div>
            ) : null}
          </div>
        )
      }))}
    </div>
  )
}
