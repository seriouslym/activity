import { useState } from "react"
import { RuleGroup, RuleGroupComponent } from "../rule/rule-group-component"
import ActConfig, { ActProp } from "./activity-config-component"
import { Input } from "../ui/input"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Steps } from 'antd'
import { Button } from "../ui/button"
import { UserAttrList } from "../rule/rule-builder"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { ActivityItem, addActivityItem, updateActivityItem } from "@/store/activity-config-slice"
import ExtraConfigComponent from "./extra-config-component"

export type ActivityStepComponentProps = {
  setIsOpen: (isOpen: boolean) => void
} & Partial<ActivityItem>

export default function ActivityStepComponent({ props }: {props: ActivityStepComponentProps}) {
  const { setIsOpen, name, baseRule, baseActItem, extraRule, extraActItem } = props
  console.log(setIsOpen, name, baseRule, baseActItem, extraRule, extraActItem)
  const dispatch = useDispatch()
  const peopleDivisions = useSelector((state: RootState) => state.peopleDivisionState.peopleDivisions)
  // 新增的用户划分
  const newUserAttrList = peopleDivisions.map(item => ({ key: item.name, value: item.type }))
  // 状态
  const [actName, setActName] = useState(name || '')
  const [baseRuleState, setbaseRuleState] = useState<RuleGroup>(baseRule || { rule: [], logic: 'and' })
  const [baseAct, setBaseAct] = useState<ActProp[]>(baseActItem || [])
  const [extraRuleState, setExtraRuleState] = useState<RuleGroup>(extraRule || { rule: [], logic: 'and' })
  const [extraAct, setExtraAct] = useState<ActProp[]>(extraActItem || [])
  // 提示
  const [alert, setAlert] = useState({ show: false, message: '' })
  const stepItems = [
    {
      title: '活动名称',
      content: <Input placeholder="请输入活动名称" onChange={(e) => {setActName(e.target.value)}} defaultValue={name}/>
    },
    {
      title: '基本规则配置',
      content: <RuleGroupComponent
        group={baseRuleState}
        onChange={(updatedRule) => {
          setbaseRuleState(updatedRule)
        }}
        userAttrList={[...UserAttrList, ...newUserAttrList]}
      />
    },
    {
      title: '基本活动配置',
      content: <ActConfig acts={baseAct} name="新增基本配置" setActs={setBaseAct}/>
    },
    {
      title: 'xxxxx',
      content: <ExtraConfigComponent/>
    },
    {
      title: '额外规则配置',
      content: <RuleGroupComponent
        group={extraRuleState}
        onChange={(updatedRule) => {
          setExtraRuleState(updatedRule)
        }}
        userAttrList={[...UserAttrList, ...newUserAttrList]}
      />
    },
  ]
  const [current, setCurrent] = useState(0)
  const next = () => setCurrent(current + 1)
  const prev = () => setCurrent(current - 1)
  const handleSubmit = () => {
    console.log('baseRuleState', baseRuleState)
    if (!actName) {
      return alertCtrl(setAlert, '请输入活动名称')
    }
    if (!checkRuleGroup(baseRuleState)) {
      return alertCtrl(setAlert, '请完善规则配置')
    }
    if (!checkActConfig(baseAct)) {
      return alertCtrl(setAlert, '请完善活动配置')
    }
    dispatch(addActivityItem({ name: actName, baseRule: baseRuleState, baseActItem: baseAct, extraRule: extraRuleState, extraActItem: extraAct }))
    setIsOpen(false)
  }
  return <div className="px-16 py-16 space-y-4">
    <div className="space-y-4">
      <Steps items={stepItems} current={current}/>
      <div className="min-h-[150px]">{stepItems[current].content}</div>
      <div>
        {alert.show && <Alert variant="destructive">
          <ExclamationTriangleIcon  className="h-4 w-4" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
        }
      </div>
      <div className="flex justify-end space-x-4">
        {current > 0 && (
          <Button className="bg-zinc-700" onClick={() => prev()}>上一步</Button>
        )}
        {current < stepItems.length - 1 && (
          <Button className="bg-zinc-700" onClick={() => next()}>下一步</Button>
        )}
        {
          current === stepItems.length - 1 && (
            name? <Button className="bg-zinc-700" onClick={() => {dispatch(updateActivityItem({ name: actName, baseRule: baseRuleState, baseActItem: baseAct, extraRule: extraRuleState, extraActItem: extraAct })); setIsOpen(false)}}>更新</Button>:
              <Button className="bg-zinc-700" onClick={handleSubmit}>提交</Button>
          )
        }
      </div>
    </div> 
  </div>
}



const alertCtrl = (setAlert: Function, message: string) => {
  setAlert({ show: true, message: message })
  setTimeout(() => {
    setAlert({ show: false, message: '' })
  }, 2000)
}

const checkRuleGroup = (ruleGroup: RuleGroup): boolean => {
  console.log(ruleGroup)
  if (ruleGroup.rule.length === 0) {
    return false
  }
  for (let rule of ruleGroup.rule) {
    if ('value' in rule) {
      if (rule.value === null || rule.value === '') {
        return false
      }
    } else {
      return checkRuleGroup(rule)
    }
  }
  return true
}

const checkActConfig = (acts: ActProp[]): boolean => {
  if (acts.length === 0) return false
  for (let act of acts) {
    if (act.value === undefined || act.value === '') {
      return false
    }
  }
  return true
}