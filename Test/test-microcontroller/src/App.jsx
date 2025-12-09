import { useState, useRef } from 'react'
import './App.css'

function App() {

  const [assembly, setAssembly] = useState(""); 
  const [registers, setRegisters] = useState({r0: 0, r1: 0, r2: 0, r3: 0, pc: 0}); 
  const [flags, setFlags] = useState({zero_flag: 0, carry_flag: 0}); 
  const [memory, setMemory] = useState(Array(4096).fill(0)); 


  const lines = assembly.split(/\r?\n/).length;
  
  const textRef = useRef(null);
  const lineRef = useRef(null);

  const handleScroll = () => {
    lineRef.current.scrollTop = textRef.current.scrollTop;
  };



  return (<div>

    <header className='navbar'>
      <h1 className='navbar-test'>Microcontroller Simulator</h1><hr/>
    </header>
    <div className='editor-container'>
      <pre className='line-numbers' ref={lineRef}>
        {
          // Generate numbers 1..lineCount
          Array.from({ length: lines }, (_, i) => i + 1).join("\n")
        }
      </pre>

      <textarea onChange={(e) => {setAssembly(e.target.value)}} value={assembly} className='area' ref={textRef} onScroll={handleScroll}>
        
      </textarea>
    </div>
   
    <h1>{assembly}</h1>
  </div>)
}

export default App
