import { useState } from 'react'
import './App.css'
import lito from './assets/ping.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Lito spelar Ping Pong med Stebors kulor</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Hur många set spelade Lito? {count}
        </button>
        <br></br>
        <br></br>
        <img src={lito} />
      </div>
    </>
  )
}

export default App
