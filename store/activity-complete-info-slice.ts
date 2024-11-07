/**
 * 活动完整信息存储
 */

import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { PeoPleDivision } from "./people-division-slice"
import { ActivityItem } from "./activity-config-slice"

type ActivityCompleteInfo = {
  name: string, // 11月活动
  startTime: string, // 2024-09-01 12:00:00
  endTime: string, // 2024-09-12 12:00:00
  peopleDivision: PeoPleDivision[], // 人群划分配置
  activityItems: ActivityItem[], // 活动配置
}


export const ActivityCompleteInfoSlice = createSlice({
  name: "activityCompleteInfoSlice",
  initialState: {
    activityCompleteInfos: [] as ActivityCompleteInfo[]
  },
  reducers: {
    addActivityCompleteInfo: (state, action: PayloadAction<ActivityCompleteInfo>) => {
      state.activityCompleteInfos.push(action.payload)
    },
  }
})

export default ActivityCompleteInfoSlice.reducer
export const { addActivityCompleteInfo } = ActivityCompleteInfoSlice.actions