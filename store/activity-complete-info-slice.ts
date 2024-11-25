/**
 * 活动完整信息存储
 */

import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { PeoPleDivision } from "./people-division-slice"
import { ActivityItem } from "./activity-config-slice"
import { DefaultSelectType } from "./default-select-slice"
import { SortConfig } from "./product-sort-slice"
import axios from "axios"

type ActivityCompleteInfo = {
  name: string, // 11月活动
  startTime: string, // 2024-09-01 12:00:00
  endTime: string, // 2024-09-12 12:00:00
  peopleDivision: PeoPleDivision[], // 人群划分配置
  activityItems: ActivityItem[], // 活动配置,
  defaultSelect: DefaultSelectType[], // 默认选择
  productSort: SortConfig, // 商品排序,
  status: number
}


export const fetchActivityCompleteInfo = createAsyncThunk('ActivityCompleteInfo/getData', async () => {
  try {
    const res = await axios.post<{data: [{config: string, status: number}]}>('http://127.0.0.1:8888/getAllActivityConfig')
    console.log('fetchActivityCompleteInfo', res.data.data)
    return res.data.data.map(item => ({ ...JSON.parse(item.config), status: item.status }))
  } catch (error) {
    const res = window.localStorage.getItem('acts')
    return res? JSON.parse(res): []
  }
})


export const ActivityCompleteInfoSlice = createSlice({
  name: "activityCompleteInfoSlice",
  initialState: {
    activityCompleteInfos: [] as ActivityCompleteInfo[]
  },
  reducers: {
    addActivityCompleteInfo: (state, action: PayloadAction<ActivityCompleteInfo>) => {
      state.activityCompleteInfos.push(action.payload)
    },
    deleteActivityCompleteInfo: (state, action: PayloadAction<number>) => {
      state.activityCompleteInfos = state.activityCompleteInfos.filter((_, index) => index !== action.payload)
    },
    updateActivityCompleteInfo: (state, action: PayloadAction<ActivityCompleteInfo & {index: number}>) => {
      state.activityCompleteInfos[action.payload.index] = {
        ...state.activityCompleteInfos[action.payload.index],
        name: action.payload.name,
        startTime: action.payload.startTime,
        endTime: action.payload.endTime,
        peopleDivision: action.payload.peopleDivision,
        activityItems: action.payload.activityItems,
        defaultSelect: action.payload.defaultSelect,
        productSort: action.payload.productSort
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchActivityCompleteInfo.fulfilled, (state, action) => {
      state.activityCompleteInfos = action.payload
    })
  }
})

export default ActivityCompleteInfoSlice.reducer
export const { addActivityCompleteInfo, deleteActivityCompleteInfo, updateActivityCompleteInfo } = ActivityCompleteInfoSlice.actions