import { ActProp } from "@/components/activity/activity-config-component"
import { RuleGroup } from "@/components/rule/rule-group-component"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"



type ExtraConfig = {
  extraRule: RuleGroup,
  extraActItem: ActProp[],
}

export const extraConfigSlice = createSlice({
  name: "extraConfig",
  initialState: {
    extraConfigs: [] as ExtraConfig[]
  },
  reducers: {
    addExtraConfig: (state, action: PayloadAction<ExtraConfig>) => {
      state.extraConfigs.push(action.payload)
    },
    deleteExtraConfig: (state, action: PayloadAction<number>) => {
      state.extraConfigs = state.extraConfigs.filter((_, index) => index !== action.payload)
    },
    updateExtraConfig: (state, action: PayloadAction<ExtraConfig & {index: number}>) => {
      state.extraConfigs[action.payload.index] = { extraRule: action.payload.extraRule, extraActItem: action.payload.extraActItem }
    },
    clearExtraConfig: (state) => {
      state.extraConfigs = []
    }
  }

})

export default extraConfigSlice.reducer
export const { addExtraConfig, deleteExtraConfig, updateExtraConfig, clearExtraConfig } = extraConfigSlice.actions