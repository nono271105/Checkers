import React from 'react'

export default function Controls({ aiPlays, setAiPlays, aiLevel, setAiLevel, startNew, undo, levels }){
  return (
    <div className="mb-4 p-4 bg-gray-800 rounded">
      <div className="mb-2"><strong>Options</strong></div>
      <div className="mb-2">
        <label className="block mb-1">IA joue:</label>
        <select value={aiPlays} onChange={e=>setAiPlays(e.target.value)} className="w-full p-2 bg-gray-700 rounded">
          <option value="none">Aucun</option>
          <option value="black">Noir</option>
          <option value="red">Rouge</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="block mb-1">Difficulté IA:</label>
        <select value={aiLevel} onChange={e=>setAiLevel(e.target.value)} className="w-full p-2 bg-gray-700 rounded">
          {levels.map(l=> <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-indigo-600 rounded" onClick={startNew}>Nouvelle partie</button>
        <button className="px-3 py-1 bg-gray-700 rounded" onClick={undo}>Annuler</button>
      </div>
    </div>
  )
}
