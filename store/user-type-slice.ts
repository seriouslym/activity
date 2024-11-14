import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const UserTypeList = [
  { key: '新客', value: 'new' },
  { key: '续费', value: 'renew' },
  { key: '其他', value: 'other' },
  { key: '回访', value: 'revisit' }
]
export const userTypeSlice = createSlice({
  name: "userType",
  initialState: {
    userTypeList: UserTypeList
  },
  reducers: {
    addUserType: (state, action: PayloadAction<{key: string, value: string}>) => {
      state.userTypeList.push(action.payload)
    },
  }
})


export default userTypeSlice.reducer
export const { addUserType } = userTypeSlice.actions

