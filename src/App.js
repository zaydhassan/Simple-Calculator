import React, { useReducer } from "react";
import DigitButtons from "./DigitButtons";
import OperationButtons from "./OperationButtons";
import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE: 'delete',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currOperand: payload.digit,
          overwrite: false,
        }
      }

      if(payload.digit === "0" && state.currOperand === "0") return state

      if(payload.digit === "." && state.currOperand.includes(".")) return state

      return {
        ...state, 
        currOperand: `${state.currOperand || ''}${payload.digit}`
      }

    case ACTIONS.CHOOSE_OPERATION:
      if(state.currOperand == null && state.prevOperand == null) return state

      if(state.currOperand == null){
        return{
          ...state,
          operation: payload.operation,
        }
      }

      if(state.prevOperand == null) {
        return{
          ...state,
          operation: payload.operation,
          prevOperand: state.currOperand,
          currOperand: null
        }
      }

      return{
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        currOperand: null
      }


    case ACTIONS.CLEAR:
      return {}
    
    case ACTIONS.DELETE:
      if(state.overwrite){
        return{
          ...state,
          overwrite: false,
          currOperand: null,
        }
      }
      if(state.currOperand == null) return state
      if(state.currOperand.length === 1){
        return {
          ...state,
          currOperand: null,
        }
      }
      return{
        ...state,
        currOperand: state.currOperand.slice(0, -1)
      }

    case ACTIONS.EVALUATE:
      if(state.operation == null || state.currOperand == null || state.prevOperand == null) return state
      
      return{
        ...state,
        overwrite: true,
        prevOperand: null,
        operation: null,
        currOperand: evaluate(state),
      }
    default:
      return state  
  } 
}

function evaluate({currOperand, prevOperand, operation}){
  const prev = parseFloat(prevOperand)
  const curr = parseFloat(currOperand)
  if(isNaN(prev) || isNaN(curr)) return ''
  let computation = ""
  switch(operation){
    case "+":
      computation= prev + curr
      break
    case "-":
      computation = prev - curr  
      break
    case "*":
      computation = prev * curr  
      break
    case "/":
      computation = prev / curr  
      break
      default:
        return computation    
  }
  return computation.toString()
}

const INT_FORMATTER = new Intl.NumberFormat("en-us", { 
  maximumFractionDigits: 0
})

function formatOperand(operand){
  if(operand == null) return
  const [integer, decimal] = operand.split(".")
  if(decimal == null) return INT_FORMATTER.format(integer)

  return `${INT_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{currOperand, prevOperand, operation}, dispatch] = useReducer(reducer, {});


  return (
    <div className="app">
      <div className="links">
        <a href="https://github.com/abhishekkokate/react-calculator" target="_blank"> <p>GitHub</p> <img src="https://img.icons8.com/glyph-neue/64/000000/github.png"/></a>
      </div>
      <div className="calculator-grid">
        <div className="output">
          <div className="prev-operand">{formatOperand(prevOperand)} {operation}</div>
          <div className="curr-operand">{formatOperand(currOperand)}</div>
        </div>
        <button className="span-two" onClick={()=>dispatch({ type: ACTIONS.CLEAR })}> AC </button>
        <button onClick={()=>dispatch({ type: ACTIONS.DELETE })}> DEL </button>
        <OperationButtons operation="/" dispatch={dispatch} />
        <DigitButtons digit="1" dispatch={dispatch} />
        <DigitButtons digit="2" dispatch={dispatch} />
        <DigitButtons digit="3" dispatch={dispatch} />
        <OperationButtons operation="*" dispatch={dispatch} />
        <DigitButtons digit="4" dispatch={dispatch} />
        <DigitButtons digit="5" dispatch={dispatch} />
        <DigitButtons digit="6" dispatch={dispatch} />
        <OperationButtons operation="+" dispatch={dispatch} />
        <DigitButtons digit="7" dispatch={dispatch} />
        <DigitButtons digit="8" dispatch={dispatch} />
        <DigitButtons digit="9" dispatch={dispatch} />
        <OperationButtons operation="-" dispatch={dispatch} />
        <DigitButtons digit="." dispatch={dispatch} />
        <DigitButtons digit="0" dispatch={dispatch} />
        <button className="span-two" onClick={()=>dispatch({ type: ACTIONS.EVALUATE })}>= </button>
      </div>
    </div>
  );
}

export default App;
