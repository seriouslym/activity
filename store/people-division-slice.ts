import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RuleGroup } from "@/components/rule/rule-group-component"

export type PeoPleDivision = {
  name: string, // 展示得文字
  type: string, // renew
  rule: RuleGroup
}
export const peopleDivisionSlice = createSlice({
  name: "peopleDivision",
  initialState: {
    peopleDivisions: [] as PeoPleDivision[]
  },
  reducers: {
    addPeopleDivision: (state, action: PayloadAction<PeoPleDivision>) => {
      state.peopleDivisions.push(action.payload)
    },
    deletePeopleDivision: (state, action: PayloadAction<number>) => {
      state.peopleDivisions = state.peopleDivisions.filter((_, index) => index !== action.payload)
    },
    updatePeopleDivision: (state, action: PayloadAction<PeoPleDivision>) => {
      const index = state.peopleDivisions.findIndex(item => item.name === action.payload.name)
      state.peopleDivisions[index] = action.payload
    }
  }
})


export default peopleDivisionSlice.reducer
export const { addPeopleDivision, deletePeopleDivision, updatePeopleDivision } = peopleDivisionSlice.actions

