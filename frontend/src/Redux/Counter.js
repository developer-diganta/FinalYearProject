import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    sideb: true,
    unvSign: false,
    openClose: true,
    universityDetail: {}
  },
  reducers: {
    increment: (state, action) => {
      state.sideb = !state.sideb
    },
    unvSignup: (state, action) => {
      state.unvSign = action.payload
    },
    closeOpen: (state, action) => {
      state.openClose = action.payload
    },
    manageUniversityDetail: (state, action) => {
      state.universityDetail = action.payload
    }
  }
})

export default counterSlice.reducer

//Actions

const { increment, unvSignup, closeOpen, manageUniversityDetail } = counterSlice.actions

export const incrementAsync = (amount) => async dispatch => {
  try {
      await dispatch(increment(amount))
  } catch (error) {
      return console.error(error.message)
  }
}

export const universitySignup = (payload) => async dispatch => {
  try {
      await dispatch(unvSignup(payload))
  } catch (error) {
      return console.error(error.message)
  }
}

export const setOpenClose = (payload) => async dispatch => {
  try {
    await dispatch(closeOpen(payload))
  } catch (error) {
    return console.error(error.message)
  }
}

export const setUniversityDetail = (payload) => async dispatch => {
  console.log(payload);
  try {
    await dispatch(manageUniversityDetail(payload))
  } catch (error) {
    return console.error(error.message)
  }
}