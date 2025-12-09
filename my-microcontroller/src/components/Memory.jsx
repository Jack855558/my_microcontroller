import React, { useState, useRef } from "react";
import './Memory.css';

export default function Memory() {
  // 4 KB memory array (0x0000 to 0x0FFF)
  const [memory, setMemory] = useState(() =>
    Array.from({ length: 0x1000 }, () => ({ value: 0, info: "" }))
  );
  
  const [searchInput, setSearchInput] = useState("");
  const [searchError, setSearchError] = useState("");
  const tableContainerRef = useRef(null);
  
  const formatAddress = (i) => "0x" + i.toString(16).padStart(4, "0").toUpperCase();
  
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError("");
    
    let address;
    const input = searchInput.trim();
    
    // Parse input (supports hex with/without 0x prefix, or decimal)
    if (input.toLowerCase().startsWith("0x")) {
      address = parseInt(input, 16);
    } else if (/^[0-9a-fA-F]+$/.test(input)) {
      address = parseInt(input, 16);
    } else if (/^\d+$/.test(input)) {
      address = parseInt(input, 10);
    } else {
      setSearchError("Invalid format. Use hex (0x0000) or decimal.");
      return;
    }
    
    // Validate range
    if (isNaN(address) || address < 0 || address > 0x0FFF) {
      setSearchError("Address out of range (0x0000 - 0x0FFF)");
      return;
    }
    
    // Scroll to the row
    const row = document.getElementById(`memory-row-${address}`);
    if (row && tableContainerRef.current) {
      const container = tableContainerRef.current;
      const rowTop = row.offsetTop;
      const containerHeight = container.clientHeight;
      const rowHeight = row.clientHeight;
      
      // Scroll so the row is centered in view
      container.scrollTop = rowTop - (containerHeight / 2) + (rowHeight / 2);
      
      // Highlight the row briefly
      row.classList.add("highlight");
      setTimeout(() => row.classList.remove("highlight"), 2000);
    }
  };
  
  return (
    <div className="memory-viewer">
      <div className="memory-viewer-content">
        <h2 className="memory-title">Memory Viewer</h2>
        
        <div className="search-bar">
          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
              placeholder="Enter address (e.g., 0x0100, 100, or 256)"
              className="search-input"
            />
            {searchError && (
              <div className="search-error">
                {searchError}
              </div>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="search-button"
          >
            Go
          </button>
        </div>
        
        <div ref={tableContainerRef} className="memory-table-container">
          <table className="memory-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Info</th>
              </tr>
            </thead>
            <tbody>
              {memory.map((cell, index) => (
                <tr 
                  key={index}
                  id={`memory-row-${index}`}
                  className="memory-row"
                >
                  <td>{formatAddress(index)}</td>
                  <td>{cell.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}