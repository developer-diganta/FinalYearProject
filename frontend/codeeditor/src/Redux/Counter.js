import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    sideb: true
  },
  reducers: {
    increment: (state, action) => {
      state.sideb = !state.sideb
    }
  }
})

export default counterSlice.reducer

//Actions

const { increment } = counterSlice.actions

export const incrementAsync = (amount) => async dispatch => {
  try {
      await dispatch(increment(amount))
  } catch (error) {
      return console.error(error.message)
  }
}