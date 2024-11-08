import { Plus } from "lucide-react"
import { Label } from "../ui/label"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { RuleGroup, RuleGroupComponent } from "../rule/rule-group-component"
import { addExtraConfig, updateExtraConfig } from "@/store/extra-config-slice"
import { UserAttrList } from "../rule/rule-builder"
import ActConfig, { ActProp } from "./activity-config-component"

export default function ExtraConfigComponent() {
  const extraConfigs = useSelector((state: RootState) => state.extraConfigReducer.extraConfigs)
  const extraRule: RuleGroup = { logic: 'and', rule: [] }
  const extraActItem: ActProp[] = []
  const dispath = useDispatch()
  return <>
    <div className="flex items-center space-x-4"> 
      <Label>新增额外配置</Label>
      <div className="rounded-full bg-zinc-700" onClick={() => dispath(addExtraConfig({ extraRule, extraActItem }))}>
        <Plus size={16} className="text-white"/>
      </div>
    </div>
    <div className="max-h-[400px] overflow-auto space-y-8 mt-4">
      {
        extraConfigs.map((config, index) => (
          <>
          
            <div key={index} className=" border border-blue-200 rounded-md p-4 w-[600px] space-y-4"> 
              <Label className="font-bold text-lg">{`配置${index+1}`}</Label>
              <div className="w-[70%]">
                <div>
                  <RuleGroupComponent
                    group={config.extraRule}
                    onChange={(updatedRule) => dispath(updateExtraConfig({ ...config, extraRule: updatedRule, index }))}
                    userAttrList={UserAttrList}
                  />
                </div>
                <div>
                  <ActConfig acts={config.extraActItem} name={"元素配置"} setActs={(updatedActs: ActProp[]) => dispath(updateExtraConfig({ ...config, extraActItem: updatedActs, index }))}/>
                </div>
              </div>
            </div>
          </>
        ))
      }
    </div>
  </>
}