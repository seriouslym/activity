import { SortProductType } from "@/components/activity/product-sort-component"
import { RuleGroup } from "@/components/rule/rule-group-component"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
export type ExtraSortConfig = {
  extraRule: RuleGroup,
  extraSort: SortProductType[]
}

export type SortConfig = {
  name: string
  defaultSort: SortProductType[],
  extraSort: ExtraSortConfig[]
}

const sortConfig: SortConfig = {
  name: "默认",
  defaultSort: [{ id: "1", name: "一年vip" }, { id: "2", name: "两年vip" }, { id: "3", name: "三年vip" }],
  extraSort: []
}

export const productSortSlice = createSlice({
  name: "productSortSlice",
  initialState: {
    sortConfig: sortConfig
  },
  reducers: {
    updateDefaultSortSort: (state, action: PayloadAction<SortProductType[]>) => {
      state.sortConfig.defaultSort = action.payload
    },
  }
})


export default productSortSlice.reducer
export const { updateDefaultSortSort } = productSortSlice.actions

