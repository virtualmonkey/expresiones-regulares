import reverse from 'lodash/reverse.js';
import last from 'lodash/last.js';
import concat from 'lodash/concat.js';
import { constants } from '../utils/constants.js'
import { functions } from '../utils/functions.js'

export default class NDFA {
  constructor(){
    this.r = null;
    this.automata = null;
    this.startEndNodes = null;
  }
 
  operatorHierarchy(operator) {
    return (operator === constants.KLEEN_CLOSURE || operator === constants.OPEN_PARENTHESIS || operator == constants.CLOSING_PARENTHESIS) ? 3 : operator === constants.OR ? 2 : operator === constants.CONCAT ? 1 : 0;
  }
  
  replacePositiveClosureForKleenClosure(string) {
    let pile = [];
    let temp = [];
    let pointer = 0;
  
    for (let i = 0; i < string.length; i++) {
      if (string[i] === constants.POSITIVE_CLOSURE){
        pointer++;
  
        if (string[i] === constants.POSITIVE_CLOSURE && last(pile) !== constants.CLOSING_PARENTHESIS){
          let reachedEnd = true;
          let stackFinalIndex = pile.length - 1;
    
          while (reachedEnd === true && stackFinalIndex !== -1){
            if (pile[stackFinalIndex] === constants.CLOSING_PARENTHESIS || pile[stackFinalIndex] === constants.CONCAT) {
              pile.pop();
              reachedEnd = false;
            } else {
              temp.push(pile.pop());
            }
            stackFinalIndex--;
          }
          pointer++;
  
          if (string[i] === constants.POSITIVE_CLOSURE){
            const reversedString = reverse(temp).join("");
            pile.push(
              constants.OPEN_PARENTHESIS
              + reversedString
              + constants.CLOSING_PARENTHESIS
              + constants.CONCAT
              + constants.OPEN_PARENTHESIS
              + reversedString
              + constants.KLEEN_CLOSURE
              + constants.CLOSING_PARENTHESIS.toString()
            );
            pointer++;
          }
          temp = [];
  
        } else {
          let reachedEnd = true;
          let stackFinalIndex = pile.length - 1;
  
          while (reachedEnd === true){
            if (pile[stackFinalIndex] === constants.OPEN_PARENTHESIS){
              temp.push(constants.OPEN_PARENTHESIS);
              pile.pop();
              reachedEnd = false;
            } else {
              temp.push(pile.pop());
            }
            stackFinalIndex--;
          }
  
          if (string[i] === constants.POSITIVE_CLOSURE){
            const reversedString = reverse(temp).join("");
            pile.push(
              constants.OPEN_PARENTHESIS
              + reversedString
              + constants.CLOSING_PARENTHESIS
              + constants.CONCAT
              + constants.OPEN_PARENTHESIS
              + reversedString
              + constants.KLEEN_CLOSURE
              .toString()
            );
            pointer++;
          }
          temp = [];
        }
      } else if (string[i] !== constants.POSITIVE_CLOSURE){ pile.push(string[i])}
    }
  
    const stringWithoutPositiveClosure = pile.join("");
  
    stringWithoutPositiveClosure[0] === constants.CONCAT ? stringWithoutPositiveClosure.pop(0) : stringWithoutPositiveClosure[0]
  
    return stringWithoutPositiveClosure;
  }
  
  replaceZeroOrOneForOrEpsilon(string) {
    let pile = [];
    let temp = [];
    let pointer = 0;
  
    for (let i = 0; i < string.length; i++) {
      if (string[i] === constants.ZERO_OR_ONE){
        pointer++;
  
        if (string[i] === constants.ZERO_OR_ONE && last(pile) !== constants.CLOSING_PARENTHESIS){
          let reachedEnd = true;
          let stackFinalIndex = pile.length - 1;
    
          while (reachedEnd === true && stackFinalIndex !== -1){
            if (pile[stackFinalIndex] === constants.CLOSING_PARENTHESIS || pile[stackFinalIndex] === constants.CONCAT) {
              pile.pop();
              reachedEnd = false;
            } else {
              temp.push(pile.pop());
            }
            stackFinalIndex--;
          }
          pointer++;
  
          if (string[i] === constants.ZERO_OR_ONE){
            const reversedString = reverse(temp).join("");
            pile.push(
              constants.OPEN_PARENTHESIS
              + reversedString
              + constants.OR
              + constants.EPSILON
              + constants.CLOSING_PARENTHESIS
              .toString()
            );
            pointer++;
          }
          temp = [];
  
        } else {
          let reachedEnd = true;
          let stackFinalIndex = pile.length - 1;
  
          while (reachedEnd === true){
            if (pile[stackFinalIndex] === constants.OPEN_PARENTHESIS){
              temp.push(constants.OPEN_PARENTHESIS);
              pile.pop();
              reachedEnd = false;
            } else {
              temp.push(pile.pop());
            }
            stackFinalIndex--;
          }
  
          if (string[i] === constants.ZERO_OR_ONE){
            const reversedString = reverse(temp).join("");
            pile.push(
              constants.OPEN_PARENTHESIS
              + reversedString
              + constants.OR
              + constants.EPSILON
              + constants.CLOSING_PARENTHESIS
              .toString()
            );
            pointer++;
          }
          temp = [];
        }
      } else if (string[i] !== constants.ZERO_OR_ONE){ pile.push(string[i])}
    }
  
    const stringWithoutZeroOrOne = pile.join("");
  
    stringWithoutZeroOrOne[0] === constants.CONCAT ? stringWithoutZeroOrOne.pop(0) : stringWithoutZeroOrOne[0]
  
    return stringWithoutZeroOrOne;
  }

  generateOrderedRegex(string) {
    let pile = [];
    let orderedRegex = [];
  
    for (let i = 0; i < string.length; i++) {
      if (string[i] === constants.OPEN_PARENTHESIS){
        pile.push(string[i]);
      } else if (string[i] === constants.CLOSING_PARENTHESIS){
        let stackLastIndex = pile.length - 1;
        while (pile[stackLastIndex] !== constants.OPEN_PARENTHESIS){
          orderedRegex.push(pile[stackLastIndex]);
          pile.pop();
          stackLastIndex--;
        }
        pile.pop();
      } else if (
        string[i] === constants.OR
        || string[i] === constants.KLEEN_CLOSURE
        || string[i] === constants.CONCAT
        ) {
          if (pile.length !== 0){
            if (last(pile) !== constants.OPEN_PARENTHESIS){
              if (this.operatorHierarchy(string[i]) >= this.operatorHierarchy(last(pile))){
                pile.push(string[i]);
              } else if (this.operatorHierarchy(string[i]) < this.operatorHierarchy(last(pile))){
                let stackLastIndex = pile.length - 1;
                if (stackLastIndex !== 0){
                  while (pile[stackLastIndex] !== constants.OPEN_PARENTHESIS){
                    orderedRegex.push(last(pile));
                    pile.pop();
                    stackLastIndex--;
                  }
                  pile.push(string[i]);
                } else {
                  orderedRegex.push(last(pile));
                  pile.pop();
                  pile.push(string[i]);
                }
              }
            } else {
              pile.push(string[i]);
            }
          } else {
            pile.push(string[i])
          }
      } else {
        orderedRegex.push(string[i]);
      }
    }
  
    pile.length != 0 ? orderedRegex = concat(orderedRegex, reverse(pile)) : orderedRegex;
    
    return orderedRegex;
  }
  
  buildNonDeterministicFiniteAutomata(expression) {
    let nodeNumber = 2;
    let pile = [];
    let startEndNodes = [];
  
    for (let symbol of expression){
      if (
        symbol !== constants.OR 
        && symbol !== constants.CONCAT 
        && symbol !== constants.KLEEN_CLOSURE
      ){
        pile.push([nodeNumber, symbol, nodeNumber + 1]);
        startEndNodes.push([ nodeNumber, nodeNumber + 1 ]);
        nodeNumber += 2;
      } else if (symbol === constants.OR){
        // base automatas
        const state0 = pile.pop();
        const state1 = pile.pop();
  
        // Add new tail of the automata and join it via epsilon to the tails of the base automatas
        const state2 =  [nodeNumber, constants.EPSILON, startEndNodes[startEndNodes.length - 2][0]];
        const state3 = [nodeNumber,constants.EPSILON,startEndNodes[startEndNodes.length - 1][0]];
  
        // Add a new head of the automata by joining the heads of the bese automatas as tails of the new node
        const state4 = [startEndNodes[startEndNodes.length - 2][1], constants.EPSILON, nodeNumber+1];
        const state5 = [startEndNodes[startEndNodes.length - 1][1], constants.EPSILON, nodeNumber+1]
  
        // Add all to the pile
        pile.push([state0, state1, state2, state3, state4, state5]);
  
        let initialNode = nodeNumber;
        let finalNode = nodeNumber + 1;
  
        nodeNumber += 2;
        
        startEndNodes.pop();
        startEndNodes.pop();
        startEndNodes.push([initialNode, finalNode])
        
      } else if (symbol === constants.KLEEN_CLOSURE){
        let initialNode = startEndNodes[startEndNodes.length-1][0];
        let finalNode = startEndNodes[startEndNodes.length-1][1];
  
        // Add the node at the beginning of the new automata and link it to the inital node
        const state0 = [nodeNumber, constants.EPSILON, initialNode];
  
        // Add an epsilon edge between the final node and the initial one
        const state1 = [finalNode, constants.EPSILON, initialNode];
  
        // initial node is now the node of the very beginning we just added
        initialNode = nodeNumber;
        nodeNumber += 1;
  
        // Add an epsilon edge between the finalNode of our automata and a new one (the acceptance node)
        const state2 = [finalNode, constants.EPSILON, nodeNumber];
  
        // Add an epsilon edge from the very beginning to the acceptance node
        const state3 = [initialNode, constants.EPSILON, nodeNumber];
  
        // Our final node is the last node we added
        finalNode = nodeNumber;
  
        // Get our final node from the previous step
        const state4 = pile.pop();
  
        // Add all nodes in order
        pile.push([state4, state0, state1 ,state2, state3]);
  
        // remove previous startEndNodes
        startEndNodes.pop();
  
        // Add new startEndNodes
        startEndNodes.push([initialNode, finalNode]);
        nodeNumber++;
  
      } else if (symbol === constants.CONCAT){
  
        // second node is the expression in the right side of the binary tree from the concat operator
        let secondNode = pile.pop();
  
        // fist node is the expression in the left side of the binary tree from the concat operator
        let firstNode = pile.pop();
  
        // start end nodes second node is the head/tail of first expression
        let startEndNodesSecondNode = startEndNodes.pop();
  
        // start end nodes first node is the head/tail of second expression
        let startEndNodesFirstNode = startEndNodes.pop();
  
        try {
          firstNode = functions.simplifyArray(firstNode, []);
          for (let expression of firstNode){
            for (let i = 0; i < expression.length; i++) {
              if (expression[i] === startEndNodesFirstNode[1]){
                expression[i] = startEndNodesSecondNode[0];
              }
            }
          }
        } catch (error) {
          for (let expression of firstNode){
            if (expression === startEndNodesFirstNode[1]){
              expression = startEndNodesSecondNode[0];
            }
          }
        }
  
        const initialNode = startEndNodesFirstNode[0];
        const finalNode = startEndNodesSecondNode[1];
  
        startEndNodes.push([initialNode, finalNode]);
        pile.push([firstNode, secondNode]);
      }
    }
  
    const automata = functions.simplifyArray(pile, []);
    return {
      "automata": automata,
      "startEndNodes": startEndNodes
    };
  }

  getNDFA(r) {

    this.r = r;

    const stringWithoutPositiveClosure = this.replacePositiveClosureForKleenClosure(this.r);
    const stringWithoutZeroOrOne = this.replaceZeroOrOneForOrEpsilon(stringWithoutPositiveClosure);
    const orderedRegex = this.generateOrderedRegex(stringWithoutZeroOrOne);
    const { automata, startEndNodes } = this.buildNonDeterministicFiniteAutomata(orderedRegex);

    this.automata = automata;
    this.startEndNodes = startEndNodes;

    return { automata, startEndNodes }
  }
}