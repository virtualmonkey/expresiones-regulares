import promptSync from 'prompt-sync';
import NDFA from './NDFA/NDFA.js';
import NDFAToDFA from './NDFAToDFA/NDFAToDFA.js';
import DFA from './DFA/DFA.js';
import { functions }  from './utils/functions.js';
import * as fs from 'fs';


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

    const errors = functions.getStringErrors(rClean);

    if (errors.length === 0){
      const ndfaInstance = new NDFA();
      const ndfa = ndfaInstance.getNDFA(rClean);

      const ndfaJsonAutomata = JSON.stringify(functions.prepareAutomatForGraphic(ndfa.automata, ndfa.startEndNodes));

      fs.writeFileSync('NDFA.json', ndfaJsonAutomata, 'utf-8');

      console.log("\n El automata ha sido guardado! Ahora puede correr 'python3 graphicUtils/graphicNDFA.py' en otra terminal para visualizarlo \n");
  
      const dfaInstance = new NDFAToDFA();
  
      const dfa = dfaInstance.getDFA(ndfa.automata, ndfa.startEndNodes);

      const jsonAutomata = JSON.stringify(functions.prepareAutomatForGraphic(dfa.dfaFinalAutomata, dfa.dfaStartEndNodes));
  
      fs.writeFileSync('NDFAtoDFA.json', jsonAutomata, 'utf8');
  
      console.log("El automata ha sido guardado! Ahora puede correr 'python3 graphicUtils/graphicNDFAToDFA.py' en otra terminal para visualizarlo \n");
  
      let validateString = true;
  
      while (validateString){
        const w = prompt("\n Ingrese la cadena a validar >> ");
  
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
    } else {
      console.log("\nERROR: La expresión regular tiene los siguientes errores:\n")
      for (let error of errors) {
        console.log(`X ${error} \n`)
      }
    }
  }

  else if (menuSelection == "2"){
    
    const r = prompt("\n Ingrese la expresión regular r >> ");

    const rClean = r.replace(/\s+/g, '');

    const errors = functions.getStringErrors(rClean);

    if (errors.length === 0){
      const dfaInstance = new DFA();

      const dfa = dfaInstance.getDirectDFA(rClean);
  
      const jsonAutomata = JSON.stringify(functions.prepareAutomatForGraphic(dfa.directDFA, dfa.directDFAStartEndNodes));
  
      fs.writeFileSync('directDFA.json', jsonAutomata, 'utf8');
  
      console.log("El automata ha sido guardado! Ahora puede correr 'python3 graphicUtils/graphicDirectDFA.py' en otra terminal para visualizarlo \n");
  
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
    } else {
      console.log("\nERROR: La expresión regular tiene los siguientes errores:\n")
      for (let error of errors) {
        console.log(`X ${error} \n`)
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
