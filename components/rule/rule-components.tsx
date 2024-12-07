
import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { BaseRule } from "@/components/rule/rule-group-component"
import { Input } from "@/components/ui/input"

const operators: BaseRule['operator'][] = ['=', '!=', '<', '>', 'in', '>=', '<=']
const platforms = [
  { label: 'PC网站', value: 'web' },
  { label: '安卓', value: 'android' },
  { label: 'iOS', value: 'ios' },
  { label: '小程序', value: 'mp' }
]


/**
 * 适用多选组件
 * 平台
 * @returns
 */
type SelectComponentProps = {
  items: { label: string, value: string }[]
  handleBasicRuleChange: (_ruleValue: Partial<BaseRule>) => void
  defaultValue: string | string[]
  operator: BaseRule['operator']
}
export function SelectComponent({ items, handleBasicRuleChange, defaultValue }: SelectComponentProps) {

  const [platformSet, setPlatformSet] = useState<Set<string>>(new Set(defaultValue))
  const checkedDefault = (value: string) => {
    if (typeof defaultValue ==='string') {
      return defaultValue === value
    }
    return defaultValue.includes(value)
  }
  const handleCheckboxChange = (checked: boolean|string,  value: string) => {
    let newSet = new Set(platformSet)
    if (checked) {
      newSet.add(value)
    } else {
      newSet.delete(value)
    }
    setPlatformSet(newSet)
    if (newSet.size > 1) {
      handleBasicRuleChange({ operator: 'in', value: Array.from(newSet) })
    } else {
      handleBasicRuleChange({ operator: '=', value: newSet.values().next().value || '' })
    }
  }
  return (
    <div className='flex justify-start space-x-4'>
      {items.map((item, index) => (
        <div className='flex items-center' key={index}>
          <Label>{item.label}</Label>
          <Checkbox value={item.value}
            onCheckedChange={(checked) => {handleCheckboxChange(checked, item.value)}}
            checked={checkedDefault(item.value)}
          />
        </div>
      ))}
    </div>
  )
}





/**
 * 适用单选框组件
 * 是否是vip
 * 用户系统
 * 小程序类型
 */
type CheckboxComponentProps = {
  defaultValue: string
  // value:选项的值 label 选项的名称
  items: { label: string, value: string }[]
  onValueChange: (_value: string) => void
}

export function CheckboxComponent({ defaultValue, items, onValueChange }: CheckboxComponentProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue)
  useEffect(() => {
    setSelectedValue(defaultValue)
    onValueChange(defaultValue)
  }, [defaultValue])
  const handleValueChange = (value: string) => {
    setSelectedValue(value)
    onValueChange(value)
  }
  return (
    <div>
      {/* 这里不使用defaultValue是因为defaultValue只在初始化时生效 当切换key的时候并不会重新渲染该组件 这里使用受控的value属性 确保组件始终是最新的 */}
      <RadioGroup value={selectedValue} className='flex justify-start' onValueChange={handleValueChange}>
        {
          items.map((item, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem value={item.value} />
              <Label>{item.label}</Label>
            </div>
          ))
        }
      </RadioGroup>
    </div>)
}

/**
 * 适用输入框
 * 创建时间
 */
type InputComponentProps = {
  operator: BaseRule['operator']
  handleBasicRuleChange: (_ruleValue: Partial<BaseRule>) => void
  inputValue: string,
  placeholder?: string
}
export function InputComponent({ operator, handleBasicRuleChange, inputValue, placeholder }: InputComponentProps) {
  useEffect(() => {
    handleBasicRuleChange({ value: inputValue, operator: operator })
  }, [])
  return (
    <>
      <div className="grid gap-2">
        <div className="grid grid-cols-8 items-center">
          <Label className="mr-2 text-sm font-semibold">运算符</Label>
          <select value={operator} onChange={(e: any) => {handleBasicRuleChange({ operator: e.target.value })}} className="mr-2">
            {operators.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-8 items-center">
          <Label className="text-sm font-semibold">值</Label>
          <Input
            type="text"
            value={inputValue}
            onChange={ (e: any) => { handleBasicRuleChange({ value: e.target.value })} }
            className="mr-2 p-1 border border-gray-300 rounded col-span-7 text-sm"
            placeholder={placeholder}
          />
        </div>
      </div>
    </>
  )
}
type UserTypeComponentProps = {
  defaultValue: string,
  handleBasicRuleChange: (_ruleValue: Partial<BaseRule>) => void
}

export function UserTypeComponent({ defaultValue, handleBasicRuleChange }: UserTypeComponentProps) {
  useEffect(() => {
    handleBasicRuleChange({ value: defaultValue, operator: '=' })
  }, [])
  return <></>
}

type ComponentByUserTypeProps = {
  userKey: string,
  inputValue: string|string[],
  operator: BaseRule['operator']
  handleBasicRuleChange: (_ruleValue: Partial<BaseRule>) => void
}
export function ComponentByUserType({ userKey, inputValue, operator, handleBasicRuleChange }: ComponentByUserTypeProps) {
  if (userKey === 'user.wasVip') return <CheckboxComponent defaultValue={inputValue as string || '1'} items={[{ label: '是', value: '1' }, { label: '不是', value: '0' }]} onValueChange={(value) => handleBasicRuleChange({ value: value, operator: '=' })} />
  if (userKey === 'user.mpType') return <CheckboxComponent defaultValue={inputValue as string || 'weixin'} items={[{ label: '微信', value: 'weixin' }, { label: '百度', value: 'baidu' }]} onValueChange={(value) => handleBasicRuleChange({ value, operator: '=' })} />
  if (userKey === 'user.systemOs') return <CheckboxComponent defaultValue={inputValue as string || 'android'} items={[{ label: '安卓', value: 'android' }, { label: '苹果', value: 'ios' }]} onValueChange={(value) => handleBasicRuleChange({ value, operator: '=' })} />
  if (userKey === 'platform') return <SelectComponent defaultValue={inputValue || ''} items={platforms} handleBasicRuleChange={handleBasicRuleChange} operator={operator} />
  if (userKey === 'user.type') return <UserTypeComponent defaultValue={inputValue as string} handleBasicRuleChange={handleBasicRuleChange} />
  if (userKey === 'user.userId') return <InputComponent operator='in' handleBasicRuleChange={handleBasicRuleChange} inputValue={inputValue as string} placeholder="使用英文分号隔开；左侧是用户id倒数第几位；右侧是用户所在的白名单；"/>
  if (userKey === 'type') return <CheckboxComponent defaultValue={inputValue as string || 'vip'} items={[{ label: 'vip', value: 'vip' }, { label: 'svip', value: 'svip' }, { label: 'teamVip', value: 'teamVip' }]} onValueChange={(value) => handleBasicRuleChange({ value, operator: '=' })} />
  if (userKey === 'origin') return <CheckboxComponent defaultValue={inputValue as string || 'market_activity'} items={[{ label: '运营活动', value: 'market_activity' }]} onValueChange={(value) => handleBasicRuleChange({ value, operator: '=' })} />
  if (userKey === 'user') return <CheckboxComponent defaultValue={inputValue as string || 'null'} items={[{ label: '全部用户', value: 'null' }]} onValueChange={(value) => handleBasicRuleChange({ value, operator: '!=' })} />
  return <InputComponent operator={operator} handleBasicRuleChange={handleBasicRuleChange} inputValue={inputValue as string} />
}
