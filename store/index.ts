import peopleDivisionSliceReducer from "@/store/people-division-slice"
import activityConfigSliceReducer from "@/store/activity-config-slice"
import activityCompleteInfoReducer, { fetchActivityCompleteInfo } from "@/store/activity-complete-info-slice"
import extraConfigReducer from "@/store/extra-config-slice"
import userTypeReducer from "@/store/user-type-slice"
import productSortReducer from "@/store/product-sort-slice"
import defaultSelectReducer from "@/store/default-select-slice"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    peopleDivisionState: peopleDivisionSliceReducer,
    activityConfigState: activityConfigSliceReducer,
    activityCompleteInfoState: activityCompleteInfoReducer,
    extraConfigReducer,
    userTypeReducer,
    productSortReducer,
    defaultSelectReducer
  }
})

store.dispatch(fetchActivityCompleteInfo())
export default store
export type RootState = ReturnType<typeof store.getState>

