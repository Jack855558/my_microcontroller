import { useRef } from 'react';
import './Assembly.css';

export default function Assembly({ assembly, setAssembly, onRun, registers, flags }) {
  const lines = assembly.split(/\r?\n/).length;
  const textRef = useRef(null);
  const lineRef = useRef(null);
  
  const handleScroll = () => {
    if (lineRef.current && textRef.current) {
      lineRef.current.scrollTop = textRef.current.scrollTop;
    }
  };
  
  return (
    <div className="assembly-container">
      <h2 className="assembly-title">Assembly Code Editor</h2>
      
      <div className="info-panel">
        <div className="info-box">
          <h3 className="info-title">Registers</h3>
          <div className="info-content">
            <div>R0: {registers.r0}</div>
            <div>R1: {registers.r1}</div>
            <div>R2: {registers.r2}</div>
            <div>R3: {registers.r3}</div>
            <div>PC: {registers.pc}</div>
          </div>
        </div>
        <div className="info-box">
          <h3 className="info-title">Flags</h3>
          <div className="info-content">
            <div>Zero: {flags.zero_flag ? '1' : '0'}</div>
            <div>Carry: {flags.carry_flag ? '1' : '0'}</div>
          </div>
        </div>
      </div>
      
      <div className="editor-wrapper">
        <pre ref={lineRef} className="line-numbers">
          {Array.from({ length: lines }, (_, i) => i + 1).join("\n")}
        </pre>
        <textarea
          ref={textRef}
          value={assembly}
          onChange={(e) => setAssembly(e.target.value)}
          onScroll={handleScroll}
          placeholder="Enter assembly code here...
Example:
MOV r0, 10
MOV r1, 5
ADD r0, r1
STORE r0, [100]
HALT"
          className="code-textarea"
        />
      </div>
      
      <button onClick={onRun} className="run-button">
        ▶ Run
      </button>
    </div>
  );
}