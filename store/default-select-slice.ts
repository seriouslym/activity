import { SortProductType } from "@/components/activity/product-sort-component"
import { RuleGroup } from "@/components/rule/rule-group-component"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"



export type DefaultSelectType = {
  name: string,
  rule: RuleGroup,
  selectProduct: SortProductType[],
}

export const defaultSelectSlice = createSlice({
  name: "defaultSelectSlice",
  initialState: {
    defaultSelectSlice: [] as DefaultSelectType[]
  },
  reducers: {
    addDefaultSelect: (state, action: PayloadAction<DefaultSelectType>) => {
      state.defaultSelectSlice.push(action.payload)
    },
    updateDefaultSelect: (state, action: PayloadAction<DefaultSelectType & {index: number}>) => {
      state.defaultSelectSlice[action.payload.index] = {
        ...state.defaultSelectSlice[action.payload.index],
        name: action.payload.name,
        rule: action.payload.rule,
        selectProduct: action.payload.selectProduct
      }
    }
  }

})

export default defaultSelectSlice.reducer
export const { addDefaultSelect, updateDefaultSelect } = defaultSelectSlice.actions