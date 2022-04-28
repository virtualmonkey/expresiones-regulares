import promptSync from 'prompt-sync';
import NDFA from './NDFA/NDFA.js';
import NDFAToDFA from './NDFAToDFA/NDFAToDFA.js';
import DFA from './DFA/DFA.js';
import util from 'util';

const prompt = promptSync();

while (true){
  console.log("\n-------------------------------------------");
  console.log("+++ Analizador de expresiones regulares +++");
  console.log("-------------------------------------------");
  console.log("\nIngrese una opción del menú: \n");
  console.log("1. Construir un AFD a partir de un AFN construido a través de una expresión regular \n2. Construir un AFD con el método directo \n3. Salir\n");
  const menuSelection = prompt(">> ");

  if(menuSelection === "1"){
    const r = prompt("Ingrese la expresión regular r >> ");

    const rClean = r.replace(/\s+/g, '')
    
    const ndfaInstance = new NDFA();
    const ndfa = ndfaInstance.getNDFA(rClean);

    const dfaInstance = new NDFAToDFA();

    const dfa = dfaInstance.getDFA(ndfa.automata, ndfa.startEndNodes)

    console.log("dfaFinalAutomata ", dfa.dfaFinalAutomata);
    console.log("dfaStartEndNodes ", dfa.dfaStartEndNodes);

    let validateString = true;

    while (validateString){
      const w = prompt("Ingrese la cadena a validar >> ");

      const result = dfaInstance.validateString(w);
  
      if (!!result){
        console.log("\nLa cadena w si pertenece al lenguaje generado por el AF(L(r))!")
      } else {
        console.log("\nLa cadena w no pertenece al lenguaje generado por el AF(L(r))!")
      }

      let keepGoing = prompt("Desea validar otra cadena? y/n >> ");
      switch(keepGoing){
        case "n":
          validateString = false;
          break;
      }
    }
  }

  else if (menuSelection == "2"){
    
    const r = prompt("Ingrese la expresión regular r >> ");

    const rClean = r.replace(/\s+/g, '');

    const dfaInstance = new DFA();

    const dfa = dfaInstance.getDirectDFA(rClean);

    // console.log("directDFA -> ", dfa.directDFA);
    // console.log("directDFAStartEndNodes -> ", dfa.directDFAStartEndNodes);

    let validateString = true;

    while (validateString){
      const w = prompt("Ingrese la cadena a validar >> ");

      const result = dfaInstance.validateString(w);
  
      if (!!result){
        console.log("\nLa cadena w si pertenece al lenguaje generado por el AF(L(r))!")
      } else {
        console.log("\nLa cadena w no pertenece al lenguaje generado por el AF(L(r))!")
      }

      let keepGoing = prompt("Desea validar otra cadena? y/n >> ");
      switch(keepGoing){
        case "n":
          validateString = false;
          break;
      }
    }
  }

  else if (menuSelection == "3"){
    console.log("Hasta luego!");
    break;
  }
  else {
    console.log("Porfavor ingrese un número del menú");
  }
}
