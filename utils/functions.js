import uniq from 'lodash/uniq.js';
import { constants } from '../utils/constants.js'

function simplifyArray (expression, array){
  const simplifiedArray = [];

  for (const node of expression) {
    if (node instanceof Array) {
      simplifyArray(node, array);
    } else {
      array.push(node);
    }
  }

  for (let i = 0; i < array.length; i+=3) {
    if (i !== array.length) {
      simplifiedArray.push([array[i], array[i + 1], array[i + 2]]);
    }
  }

  return simplifiedArray;
}

function prepareAutomatForGraphic(transitions, startEndNodes){
  const automata = transitions.map((transition) => {
    return {
      initialState: "s"+transition[0],
      symbol: transition[1],
      finalState: "s"+transition[2]
    }
  });

  const acceptanceStates = uniq(startEndNodes.map(startEndNode => "s"+startEndNode[1]));
  const initialState = uniq(startEndNodes.map(startEndNode => "s"+startEndNode[0]))

  return {
    automata,
    acceptanceStates,
    initialState
  }
}

function getSymbols(string){
  const operators = [
    constants.OPEN_PARENTHESIS,
    constants.CLOSING_PARENTHESIS,
    constants.OR,
    constants.POSITIVE_CLOSURE,
    constants.KLEEN_CLOSURE,
    constants.CONCAT,
    constants.ZERO_OR_ONE,
    constants.EPSILON
  ]
  const symbols = [];

  for (let character of string){
    if (!operators.includes(character)){
      if (!symbols.includes(character)){
        symbols.push(character)
      }
    }
  }

  return symbols;
}

function parenthesisBalanced(string){
  let openParenthesis = 0;
  let closingParenthesis = 0;
  let charCount = 0;
  for (let index = 0; index < string.length; index++){
    (string[index] === "(") ? openParenthesis++ : (string[index] === ")") ? closingParenthesis++ : charCount++;
  }

  if (openParenthesis === closingParenthesis) return true;

  return false;
}

function orderedParenthesis(string){
  let order = 0;

  for (let index = 0; index < string.length; index++){
    if (string[index] === "(") order++;
    else if (string[index] === ")") order--;

    if (order < 0) return false;
  }

  return true;
}

function notDoubleOperators(string){
  if ((string.match(/\+\+/g) || []).length > 0) return false;
  if ((string.match(/\.{2}/g) || []).length > 0) return false;
  if ((string.match(/\*{2}/g) || []).length > 0) return false;
  if ((string.match(/\|{2}/g) || []).length > 0) return false;
  if ((string.match(/\?{2}/g) || []).length > 0) return false;
  return true;
}

function notDivorcedOperator(string){
  const operators = [
    constants.OR,
    constants.POSITIVE_CLOSURE,
    constants.KLEEN_CLOSURE,
    constants.CONCAT,
    constants.ZERO_OR_ONE
  ]

  const symbols = getSymbols(string);

  for (let index = 0; index < string.length; index++){
    if (operators.includes(string[index])){
      if (
        string[index-1] !== constants.CLOSING_PARENTHESIS &&
        !symbols.includes(string[index-1]) &&
        (string[index] !== "|" && string[index-1] !== "*") &&
        (string[index] !== "|" && string[index-1] !== "+") &&
        (string[index] !== "." && string[index-1] !== "*") &&
        (string[index] !== "." && string[index-1] !== "+")
      ){
        return false;
      }
    }
  }

  return true;
}

function getStringErrors(string){
  const errorsArray = [];

  if (parenthesisBalanced(string) === false) errorsArray.push("Paréntesis desbalanceados");

  if (orderedParenthesis(string) === false) errorsArray.push("Paréntesis desordenados");

  if (notDoubleOperators(string) === false) errorsArray.push("Dos operadores de forma conscutiva");

  if (notDivorcedOperator(string) === false) errorsArray.push("Un operador no está asociado a un terminal");

  return errorsArray;
}

export const functions = {
  simplifyArray,
  prepareAutomatForGraphic,
  getStringErrors
}