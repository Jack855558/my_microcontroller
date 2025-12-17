import { useState } from 'react';
import './App.css';
import Assembly from './components/Assembly'; 
import Memory from './components/Memory';
import { assemble } from './components/assembler'; 
import { execute } from './components/executor'; 

export default function App() {
  const [assembly, setAssembly] = useState("");
  const [registers, setRegisters] = useState({ r0: 0, r1: 0, r2: 0, r3: 0, pc: 0 });
  const [flags, setFlags] = useState({ zero_flag: false, carry_flag: false });
  const [memory, setMemory] = useState(Array(4096).fill(0));
  const [activeTab, setActiveTab] = useState('assembly');
  
  const handleRun = () => {
    console.log("Code is Running..!");
    try {
      const program = assemble(assembly);
      console.log('Assembled program:', program);
      
      const result = execute(program, registers, memory, flags);
      setRegisters(result.registers);
      setMemory(result.memory);
      setFlags(result.flags);
      console.log('Final registers:', result.registers);
    } catch (error) {
      console.error('Execution error:', error);
      alert('Error: ' + error.message);
    }
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">⚡ Microcontroller Simulator</h1>
      </header>
      
      <div className="tab-bar">
        <div className="tab-buttons">
          <button
            onClick={() => setActiveTab('assembly')}
            className={`tab-button ${activeTab === 'assembly' ? 'active' : ''}`}
          >
            Assembly Code
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`tab-button ${activeTab === 'memory' ? 'active' : ''}`}
          >
            Memory Viewer
          </button>
        </div>
      </div>
      
      <main className="main-content">
        {activeTab === 'assembly' && (
          <Assembly
            assembly={assembly}
            setAssembly={setAssembly}
            onRun={handleRun}
            registers={registers}
            flags={flags}
          />
        )}
        {activeTab === 'memory' && (
          <Memory memory={memory} />
        )}
      </main>
      
      <footer className="app-footer">
        Made by Jack Harty —{" "}
        <a href="mailto:sportingjdh@icloud.com" className="footer-link">
          sportingjdh@icloud.com
        </a>
      </footer>
    </div>
  );
}