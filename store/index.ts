import peopleDivisionSliceReducer from "@/store/people-division-slice"
import activityConfigSliceReducer from "@/store/activity-config-slice"
import activityCompleteInfoReducer from "@/store/activity-complete-info-slice"
import extraConfigReducer from "@/store/extra-config-slice"
import userTypeReducer from "@/store/user-type-slice"
import productSortReducer from "@/store/product-sort-slice"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    peopleDivisionState: peopleDivisionSliceReducer,
    activityConfigState: activityConfigSliceReducer,
    activityCompleteInfoState: activityCompleteInfoReducer,
    extraConfigReducer,
    userTypeReducer,
    productSortReducer
  }
})

export default store
export type RootState = ReturnType<typeof store.getState>

