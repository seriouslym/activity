/**
 * 活动配置存储
 */


import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RuleGroup } from "@/components/rule/rule-group-component"
import { ActProp } from "@/components/activity/activity-config-component"

export type ActivityItem = {
  name: string, // 活动名称
  baseRule: RuleGroup, // renew
  baseActItem: ActProp[],
  extraRule: RuleGroup,
  extraActItem: ActProp[],
}
export const activityConfigSlice = createSlice({
  name: "activityConfigSlice",
  initialState: {
    activityItems: [] as ActivityItem[]
  },
  reducers: {
    addActivityItem: (state, action: PayloadAction<ActivityItem>) => {
      state.activityItems.push(action.payload)
    },
    deleteActivityItem: (state, action: PayloadAction<number>) => {
      state.activityItems = state.activityItems.filter((_, index) => index !== action.payload)
    },
    updateActivityItem: (state, action: PayloadAction<ActivityItem>) => {
      const index = state.activityItems.findIndex(item => item.name === action.payload.name)
      state.activityItems[index] = action.payload
    },
    clearActivityItem: (state) => {
      state.activityItems = []
    }
  }
})


export default activityConfigSlice.reducer
export const { addActivityItem, deleteActivityItem, updateActivityItem, clearActivityItem } = activityConfigSlice.actions

