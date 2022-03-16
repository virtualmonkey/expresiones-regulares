import NDFA from './nonDeterministicFiniteAutomata/NDFA.js';
import cytoscape from 'cytoscape';

const ndfa = new NDFA();
const { automata, startEndNodes } = ndfa.getNDFA("(a|b)*.a.b.b")

console.log(automata);
console.log(startEndNodes);
