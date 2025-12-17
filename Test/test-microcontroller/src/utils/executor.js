/**
 * Executes an assembled program
 * @param {Object} program - The assembled program
 * @param {Object} registers - CPU registers
 * @param {Array} memory - Memory array
 * @param {Object} flags - CPU flags
 */

export function execute(program, registers, memory, flags) {
  let pc = registers.pc ?? 0;
  let running = true; 

  //Start fetch, decode cycle
  while (running && pc < program.instructions.length){
    //fetch current instruction 
    const instruction = program.instructions[pc]; 
    const { opcode, operands } = instruction; 

    //decode and execute
    switch(opcode){
        case 'MOV':
            registers[operands[0]] = parseInt(operands[1]) || 0; 
            break; 
        case 'ADD': 
            registers[operands[0]] += parseInt(operands[1]) || 0;
            flags.zero = registers[operands[0]] === 0;
            break;
        case 'SUB': 
            registers[operands[0]] -= parseInt(operands[1]) || 0;
            flags.zero = registers[operands[0]] === 0;
            break;
        case 'LOAD': 
            const loadAddr = parseInt(operands[1].replace(/\[|\]/g, '')); //replace function removes "[]"
            registers[operands[0]] = memory[loadAddr]; 
            break; 
        case 'STORE': 
            const storeAddress = parseInt(operands[1].replace(/\[|\]/g, '')); 
            memory[storeAddress] = registers[operands[0]]; 
            break; 
        case 'JMP': 
            pc = program.labels[operands[0]]; 
            continue; //skip pc increment
        case 'JZ': //Jump if zero
            if (flags.zero) {
                pc = program.labels[operands[0]];
                continue;}
            break;
        case 'HALT': // Stop execution
            running = false;
            break;
        default:
            console.error(`Unknown opcode: ${opcode}`);
            running = false;
    }
    pc++;
  }
  
}