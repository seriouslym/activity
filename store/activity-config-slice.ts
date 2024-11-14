/**
 * 活动配置存储
 */


import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RuleGroup } from "@/components/rule/rule-group-component"
import { ActProp } from "@/components/activity/activity-config-component"
import { ExtraConfig } from "./extra-config-slice"

export type ActivityItem = {
  name: string, // 活动名称
  baseRule: RuleGroup, // renew
  baseActItem: ActProp[],
  extraConfigs: ExtraConfig[]
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
    updateActivityItem: (state, action: PayloadAction<ActivityItem & {index: number}>) => {
      state.activityItems[action.payload.index] = {
        name: action.payload.name,
        baseRule: action.payload.baseRule,
        baseActItem: action.payload.baseActItem,
        extraConfigs: action.payload.extraConfigs
      }
    },
    clearActivityItem: (state) => {
      state.activityItems = []
    }, 
    setActivityItem: (state, action: PayloadAction<ActivityItem[]>) => {
      state.activityItems = action.payload
    }
  }
})


export default activityConfigSlice.reducer
export const { addActivityItem, deleteActivityItem, updateActivityItem, clearActivityItem, setActivityItem } = activityConfigSlice.actions

