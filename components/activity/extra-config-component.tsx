import { Dot, Plus } from "lucide-react"
import { Label } from "../ui/label"
import { RuleGroup, RuleGroupComponent } from "../rule/rule-group-component"
import { ExtraConfig } from "@/store/extra-config-slice"
import { UserAttrList } from "../rule/rule-builder"
import ActConfig, { ActProp } from "./activity-config-component"

export default function ExtraConfigComponent({ extraConfigsState, setExtraConfigsState }: {extraConfigsState: ExtraConfig[], setExtraConfigsState: (extraConfigs: ExtraConfig[]) => void}) {
  const extraRule: RuleGroup = { logic: 'and', rule: [] }
  const extraActItem: ActProp[] = []
  const addExtraConfig = () => {
    setExtraConfigsState([...extraConfigsState, { extraRule, extraActItem }])
  }
  const updateExtraRule = (updatedRule: RuleGroup, index: number) => {
    const newExtraConfigs = extraConfigsState.map((config, i) =>
      i === index ? { ...config, extraRule: { ...updatedRule } } : config
    )
    setExtraConfigsState(newExtraConfigs)
  }

  const updateExtraAct = (updatedAct: ActProp[], index: number) => {
    const newExtraConfigs = extraConfigsState.map((config, i) =>
      i === index ? { ...config, extraActItem: updatedAct } : config
    )
    setExtraConfigsState(newExtraConfigs)
  }
  return <>
    <div className="flex items-center space-x-4"> 
      <Label>新增额外配置</Label>
      <div className="rounded-full bg-zinc-700" onClick={addExtraConfig}>
        <Plus size={16} className="text-white"/>
      </div>
    </div>
    <div className="max-h-[400px] overflow-auto space-y-8 mt-4">
      {
        extraConfigsState.map((config, index) => (
          <>
          
            <div key={index} className="border border-gray-400 rounded-lg p-4 w-[600px] space-y-4"> 
              <Label className="font-bold text-lg">{`配置${index+1}`}</Label>
              <div className="w-[70%]">
                <div className="flex">
                  <Dot size={32}/>
                  <div className="flex-1">
                    <RuleGroupComponent
                      group={config.extraRule}
                      onChange={(updatedRule) => updateExtraRule(updatedRule, index)}
                      userAttrList={UserAttrList}
                    />
                  </div>
                </div>
                <div className="flex space-y-2">
                  <Dot size={32} className="shrink-0"/>
                  <div className="flex-1">
                    <ActConfig acts={config.extraActItem} name={"元素配置"} setActs={(updatedActs: ActProp[]) => updateExtraAct(updatedActs, index)}/>
                  </div>
                </div>
              </div>
            </div>
          </>
        ))
      }
    </div>
  </>
}