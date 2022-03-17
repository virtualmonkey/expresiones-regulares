import promptSync from 'prompt-sync';
import { spawn } from 'child_process';
import NDFA from './NDFA/NDFA.js';

const prompt = promptSync();

while (true){
  console.log("\n+++ Analizador de expresiones regulares +++");
  console.log("Ingrese una opción del menú: \n");
  console.log("1. Construir un AFN dada una expresión regular \n");
  const menuSelection = prompt(">> ");

  if(menuSelection === "1"){
    const regex = prompt("Ingrese la expresión regular >> ");
    const ndfa = new NDFA();
    const { automata, startEndNodes } = ndfa.getNDFA(regex);
    console.log(automata);
    console.log(startEndNodes);
  } else {
    break;
  }
}
