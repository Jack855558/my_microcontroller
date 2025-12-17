/**
 * Assembles assembly code into a program
 * @param {string} assembly - Assembly code as a string
 * @returns {Object} Assembled program object
 */

export function assemble(assembly) {

  // Your assembly logic here

    const lines = assembly.trim().split('\n');
    const instructions = [];
    const labels = {};

    //Pass 1, find all labels and their positions
    let address = 0; 
    for (const line of lines){
        const trimmed = line.trim(); //Removes whitespace
        if (!trimmed || trimmed.startsWith(';')) continue; //Skip if empty or commented out (;)
        if (trimmed.endsWith(':')){
            labels[trimmed.slice(0, -1)] = address; //Label group like "LOOP:"
        }else{
            address++; 
        }
    }
  
    //Pass 2, convert instructions (opcode + operators) to machine code
    address = 0; 
    for (const line of lines){
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(';') || trimmed.endsWith(':')) continue;

        //Parse instructions
        const parts = trimmed.split(/\s+/);
        const opcode = parts[0].toUpperCase();
        const operands = parts.slice(1).join('').split(',');

        //Convert to machine instructions
        instructions.push({
            address,
            opcode, 
            operands: operands.map(op => op.trim()),
            originalLine: trimmed
        })
        address++; 
    }
  return { instructions, labels };
}