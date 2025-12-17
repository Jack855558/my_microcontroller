import { useState, useRef } from 'react'
import './App.css'

//utils
import { assemble } from "./utils/assembler";
import { execute } from "./utils/executor";



function App() {

  const [assembly, setAssembly] = useState(""); 
  const [registers, setRegisters] = useState({r0: 0, r1: 0, r2: 0, r3: 0, pc: 0}); 
  const [flags, setFlags] = useState({zero_flag: false, carry_flag: false}); 
  const [memory, setMemory] = useState(Array(4096).fill(0)); 


  const lines = assembly.split(/\r?\n/).length;
  
  const textRef = useRef(null);
  const lineRef = useRef(null);

  const handleScroll = () => {
    lineRef.current.scrollTop = textRef.current.scrollTop;
  };

  const handleRun = () => {
    console.log("Code is Running..! ")
    const program = assemble(assembly); 
    console.log('Assembled program:', program);
    
    const result = execute(program, registers, memory, flags);
    setRegisters(result.registers);
    setMemory(result.memory);
    setFlags(result.flags);

    console.log('Final registers:', registers);
  }


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

      <button className='run-button' onClick={handleRun}>Run</button>
    </div>
   
    <h1>{assembly}</h1>
  </div>)
}

export default App
