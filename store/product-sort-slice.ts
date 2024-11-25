import { productIDS } from "@/components/activity/activity-config-component"
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
  defaultSort: productIDS.filter(item => ['连续包月', '包年VIP', '半年VIP', '一年VIP', '两年VIP', '三年VIP'].includes(item.label)).map(item => ({ id: item.value, name: item.label })),
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
    updateExtraSort: (state, action: PayloadAction<ExtraSortConfig[]>) => {
      state.sortConfig.extraSort = action.payload
    }
  }
})


export default productSortSlice.reducer
export const { updateDefaultSortSort, updateExtraSort } = productSortSlice.actions

