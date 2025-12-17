/**
 * Executes an assembled program
 * @param {Object} program - The assembled program
 * @param {Object} registers - CPU registers
 * @param {Array} memory - Memory array
 * @param {Object} flags - CPU flags
 */

// Executor
export function execute(program, registers, memory, flags) {
  let pc = 0;
  let running = true;
  const newRegisters = { r0: registers.r0, r1: registers.r1, r2: registers.r2, r3: registers.r3, pc: 0 };
  const newMemory = [...memory];
  const newFlags = { ...flags };
  
  const getRegValue = (operand) => {
    if (operand.startsWith('r')) {
      return newRegisters[operand];
    }
    return parseInt(operand) || 0;
  };
  
  while (running && pc < program.instructions.length) {
    const instruction = program.instructions[pc];
    const { opcode, operands } = instruction;
    
    switch(opcode) {
      case 'MOV':
        newRegisters[operands[0]] = getRegValue(operands[1]);
        break;
      case 'ADD':
        newRegisters[operands[0]] = (newRegisters[operands[0]] || 0) + getRegValue(operands[1]);
        newFlags.zero_flag = newRegisters[operands[0]] === 0;
        break;
      case 'SUB':
        newRegisters[operands[0]] = (newRegisters[operands[0]] || 0) - getRegValue(operands[1]);
        newFlags.zero_flag = newRegisters[operands[0]] === 0;
        break;
      case 'LOAD':
        const loadAddrStr = operands[1].replace(/\[|\]/g, '').trim();
        const loadAddr = loadAddrStr.startsWith('0x') 
          ? parseInt(loadAddrStr, 16) 
          : parseInt(loadAddrStr, 10);
        newRegisters[operands[0]] = newMemory[loadAddr] || 0;
        break;
      case 'STORE':
        const storeAddrStr = operands[1].replace(/\[|\]/g, '').trim();
        const storeAddr = storeAddrStr.startsWith('0x') 
          ? parseInt(storeAddrStr, 16) 
          : parseInt(storeAddrStr, 10);
        newMemory[storeAddr] = newRegisters[operands[0]] || 0;
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