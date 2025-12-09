import React, { useState, useRef } from "react";
import './Memory.css';

export default function Memory() {
  // Initialize 4 KB memory array (0x0000 to 0x0FFF = 4096 bytes)
  // Each cell contains a value and info field
  const [memory, setMemory] = useState(() =>
    Array.from({ length: 0x1000 }, () => ({ value: 0, info: "" }))
  );
  
  // State for the search input field
  const [searchInput, setSearchInput] = useState("");
  
  // State for displaying validation errors
  const [searchError, setSearchError] = useState("");
  
  // Reference to the scrollable table container for programmatic scrolling
  const tableContainerRef = useRef(null);
  
  // Format memory address as hex string (e.g., 255 -> "0x00FF")
  const formatAddress = (i) => "0x" + i.toString(16).padStart(4, "0").toUpperCase();
  
  // Handle search button click or Enter key press
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError(""); // Clear any previous errors
    
    let address;
    const input = searchInput.trim();
    
    // Parse input - supports multiple formats:
    // - Hex with 0x prefix (e.g., "0x0100")
    // - Hex without prefix (e.g., "100")
    // - Decimal (e.g., "256")
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
    
    // Validate that address is within valid memory range
    if (isNaN(address) || address < 0 || address > 0x0FFF) {
      setSearchError("Address out of range (0x0000 - 0x0FFF)");
      return;
    }
    
    // Scroll to the target memory row
    const row = document.getElementById(`memory-row-${address}`);
    if (row && tableContainerRef.current) {
      const container = tableContainerRef.current;
      const rowTop = row.offsetTop;
      const containerHeight = container.clientHeight;
      const rowHeight = row.clientHeight;
      
      // Center the target row in the viewport
      container.scrollTop = rowTop - (containerHeight / 2) + (rowHeight / 2);
      
      // Add highlight class to visually indicate the found row
      row.classList.add("highlight");
      // Remove highlight after 2 seconds
      setTimeout(() => row.classList.remove("highlight"), 2000);
    }
  };
  
  return (
    <div className="memory-viewer">
      <div className="memory-viewer-content">
        <h2 className="memory-title">Memory Viewer</h2>
        
        {/* Search bar for jumping to specific memory addresses */}
        <div className="search-bar">
          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(e)} // Submit on Enter key
              placeholder="Enter address (e.g., 0x0100, 100, or 256)"
              className="search-input"
            />
            {/* Display error message if validation fails */}
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
        
        {/* Scrollable container for the memory table */}
        <div ref={tableContainerRef} className="memory-table-container">
          <table className="memory-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Info</th>
              </tr>
            </thead>
            <tbody>
              {/* Render all 4096 memory locations */}
              {memory.map((cell, index) => (
                <tr 
                  key={index}
                  id={`memory-row-${index}`} // ID for scroll targeting
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