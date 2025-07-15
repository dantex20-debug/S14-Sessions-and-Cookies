import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center w-full max-w-md">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Vite + React + Tailwind</h1>
        <p className="text-gray-600 mb-6">Tailwind CSS is now integrated! 🎉</p>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition mb-4"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="text-sm text-gray-500">Edit <code>src/App.jsx</code> and save to test HMR</p>
      </div>
      <footer className="mt-8 text-gray-400 text-xs">Cloud Trading Robot App &copy; 2024</footer>
    </div>
  )
}

export default App
