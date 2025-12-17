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
  const newRegisters = { ...registers };
  const newMemory = [...memory];
  const newFlags = { ...flags };
  
  while (running && pc < program.instructions.length) {
    const instruction = program.instructions[pc];
    const { opcode, operands } = instruction;
    
    switch(opcode) {
      case 'MOV':
        newRegisters[operands[0]] = parseInt(operands[1]) || 0;
        break;
      case 'ADD':
        newRegisters[operands[0]] += parseInt(operands[1]) || 0;
        newFlags.zero_flag = newRegisters[operands[0]] === 0;
        break;
      case 'SUB':
        newRegisters[operands[0]] -= parseInt(operands[1]) || 0;
        newFlags.zero_flag = newRegisters[operands[0]] === 0;
        break;
      case 'LOAD':
        const loadAddr = parseInt(operands[1].replace(/\[|\]/g, ''));
        newRegisters[operands[0]] = newMemory[loadAddr];
        break;
      case 'STORE':
        const storeAddress = parseInt(operands[1].replace(/\[|\]/g, ''));
        newMemory[storeAddress] = newRegisters[operands[0]];
        break;
      case 'JMP':
        pc = program.labels[operands[0]];
        continue;
      case 'JZ':
        if (newFlags.zero_flag) {
          pc = program.labels[operands[0]];
          continue;
        }
        break;
      case 'HALT':
        running = false;
        break;
      default:
        console.error(`Unknown opcode: ${opcode}`);
        running = false;
    }
    pc++;
  }
  
  newRegisters.pc = pc;
  return { registers: newRegisters, memory: newMemory, flags: newFlags };
}
