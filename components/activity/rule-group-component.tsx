import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import { ComponentByUserType } from "@/components/activity/rule-components"
export type RuleGroup = {
  logic: 'and' | 'or'
  rule: Rule[]
}
export type Rule = RuleGroup | BaseRule
export type BaseRule = {
  key: string
  operator: '==' | '!=' | '<' | '>' | 'in'
  value: any
}
type RuleGroupProps = {
  group: RuleGroup,
  onChange: (_ruleGroup: RuleGroup) => void,
  onDelete?: () => void, level?: number
  userAttrList: { key: string, value: string }[]
}

type RuleFormProps = {
  rule: BaseRule,
  onChange: (_rule: BaseRule) => void,
  onDelete: () => void
  userAttrList: { key: string, value: string }[]
}

export const UserTypeList = [
  { key: '新客', value: 'new' },
  { key: '续费', value: 'renew' },
  { key: '其他', value: 'other' },
  { key: '回访', value: 'revisit' }
]

function RuleForm({ rule, onChange, onDelete, userAttrList }: RuleFormProps) {
  const handleBasicRuleChange = (ruleValue: Partial<BaseRule>) => {
    onChange({ ...rule, ...ruleValue })
  }
  return (
    <div className="rule mb-4 p-2 border border-gray-300 rounded-md relative space-y-2">
      <div className='space-x-2'>
        <label className="mr-2 text-sm font-semibold">用户属性</label>
        <select value={rule.key === 'user.type'? rule.value: rule.key} onChange={(e: any) => {
          let key = e.target.value
          let value = null
          if (UserTypeList.map(item => item.value).includes(key)) {
            key = 'user.type'
            value = e.target.value
          }
          onChange({ ...rule, key, value })}} className="mr-2">
          {userAttrList.map((attr) => (
            <option key={attr.key} value={attr.value} label={attr.key}></option>
          ))}
        </select>
      </div>
      <div className='space-x-2'>
        <ComponentByUserType
          userKey={rule.key}
          inputValue={rule.value}
          operator={rule.operator}
          handleBasicRuleChange={handleBasicRuleChange}
        />
      </div>
      <button onClick={onDelete} className='absolute top-0 right-0 text-zinc-500' type='button'>
        <X size={20}/>
      </button>
    </div>
  )
}
export function RuleGroupComponent({ group, onChange, onDelete, level = 0, userAttrList }: RuleGroupProps) {

  const handleLogicChange = (e: any) => {
    onChange({ logic: e.target.value, rule: group.rule })
  }
  const addRule = () => {
    const newRule: BaseRule = { key: userAttrList[0].value, operator: '==', value: null }
    console.log('new rule', newRule)
    const updatedRules = [...group.rule, newRule]
    onChange({ logic: group.logic, rule: updatedRules })
  }
  const addGroup = () => {
    const newGroup: RuleGroup = { logic: 'and', rule: [] }
    const updatedRules: Rule[] = [...group.rule, newGroup]
    onChange({ logic: group.logic, rule: updatedRules })
  }

  const handleRuleChange = (index: number, updatedRule: Rule) => {
    const newRules = [...group.rule]
    newRules[index] = updatedRule
    onChange({ logic: group.logic, rule: newRules })
  }

  const handleRuleDelete = (index: number) => {
    const newRules = group.rule.filter((_, i) => i !== index)
    onChange({ logic: group.logic, rule: newRules })
  }

  return (
    <div className="rule-group mb-4 p-4 border border-gray-400 rounded-lg bg-gray-100 relative" style={{ marginLeft: `${level * 20}px` }}>
      <div className="mb-2 flex justify-start items-center">
        <Label className="mr-2 font-semibold">关联关系:</Label>
        <select value={group.logic} onChange={handleLogicChange} className="p-1 border border-gray-300 rounded text-sm">
          <option value="and">且逻辑</option>
          <option value="or">或逻辑</option>
        </select>
      </div>
      <div className="rule-list">
        {group.rule.map((rule: Rule, index: number) =>
          // 类型守卫 直接使用rule.logic ts 会报错
          'logic' in rule ? (
            <RuleGroupComponent
              key={index}
              group={rule}
              onChange={(updatedRule) => handleRuleChange(index, updatedRule)}
              onDelete={() => handleRuleDelete(index)}
              level={level + 1}
              userAttrList={userAttrList}
            />
          ) : (
            <RuleForm
              key={index}
              rule={rule}
              userAttrList={userAttrList}
              onChange={(updatedRule) => handleRuleChange(index, updatedRule)}
              onDelete={() => handleRuleDelete(index)}
            />
          )
        )}
      </div>
      <div className="mt-4 space-x-4">
        <button onClick={addRule} className="mr-2 text-blue-500 hover:cursor-pointer" type='button'>
          <div className='flex justify-start items-center'>
            <Plus size={20}/>
            <Label>
              <span>规则</span>
            </Label>
          </div>
        </button>
        <button onClick={addGroup} className="text-blue-500" type='button'>
          <div className='flex justify-start items-center'>
            <Plus size={20}/>
            <Label>
              <span>规则组</span>
            </Label>
          </div>
        </button>
      </div>
      <div className=' absolute top-0 right-0'>
        {level > 0 && (
          <button onClick={onDelete} className="mt-2 text-zinc-500">
            <X size={20}/>
          </button>
        )}
      </div>
    </div>
  )
}
