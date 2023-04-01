import { ACTIONS } from "./App"

export default function DigitButtons({dispatch, digit}) {
  return <button 
  onClick={()=> dispatch({type: ACTIONS.ADD_DIGIT, payload: {digit} })} > {digit} </button>
}
