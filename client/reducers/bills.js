const initialState = []

export default function bills (state = initialState, action) {
  switch (action.type) {
    case 'RECEIVE_BILLS':
      return action.bills
    case 'RECEIVE_BILL_INFO':
      return action.billInfo
    default:
      return state
  }
}
