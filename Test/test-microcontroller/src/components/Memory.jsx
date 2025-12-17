import { useState, useRef } from 'react';
import './Memory.css';

export default function Memory({ memory }) {
  const [searchInput, setSearchInput] = useState("");
  const [searchError, setSearchError] = useState("");
  const tableContainerRef = useRef(null);
  
  const formatAddress = (i) => "0x" + i.toString(16).padStart(4, "0").toUpperCase();
  
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError("");
    
    let address;
    const input = searchInput.trim();
    
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
    
    if (isNaN(address) || address < 0 || address > 0x0FFF) {
      setSearchError("Address out of range (0x0000 - 0x0FFF)");
      return;
    }
    
    const row = document.getElementById(`memory-row-${address}`);
    if (row && tableContainerRef.current) {
      const container = tableContainerRef.current;
      const rowTop = row.offsetTop;
      const containerHeight = container.clientHeight;
      const rowHeight = row.clientHeight;
      
      container.scrollTop = rowTop - (containerHeight / 2) + (rowHeight / 2);
      
      row.classList.add("highlight");
      setTimeout(() => row.classList.remove("highlight"), 2000);
    }
  };
  
  return (
    <div className="memory-container">
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
        <button onClick={handleSearch} className="search-button">
          Go
        </button>
      </div>
      
      <div ref={tableContainerRef} className="table-container">
        <table className="memory-table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Address</th>
              <th className="table-header-cell">Value</th>
            </tr>
          </thead>
          <tbody>
            {memory.map((value, index) => (
              <tr 
                key={index}
                id={`memory-row-${index}`}
                className="table-row"
              >
                <td className="table-cell address-cell">
                  {formatAddress(index)}
                </td>
                <td className="table-cell value-cell">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}