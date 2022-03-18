import promptSync from 'prompt-sync';
import NDFA from './NDFA/NDFA.js';
import NDFAToDFA from './NDFAToDFA/NDFAToDFA.js'

const prompt = promptSync();

while (true){
  console.log("\n+++ Analizador de expresiones regulares +++");
  console.log("Ingrese una opción del menú: \n");
  console.log("1. Construir un AFD a partir de un AFN construido a través de una expresión regular \n2. Salir\n");
  const menuSelection = prompt(">> ");

  if(menuSelection === "1"){
    const regex = prompt("Ingrese la expresión regular >> ");
    const ndfa = new NDFA();
    const { automata, startEndNodes } = ndfa.getNDFA(regex);

    const dfa = new NDFAToDFA();

    const { dfaFinalAutomata, dfaStartEndNodes } = dfa.getDFA(automata.sort((a,b) => {
      return a[0] - b[0]
    }), startEndNodes)
  }

  else if (menuSelection == "2"){
    console.log("Hasta luego!");
    break;
  }
  else {
    console.log("Porfavor ingrese un número del menú");
  }
}
