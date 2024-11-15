'use client'
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { RuleGroupComponent, RuleGroup } from "@/components/rule/rule-group-component"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDispatch, useSelector } from "react-redux"
import { PeoPleDivision, addPeopleDivision, updatePeopleDivision } from "@/store/people-division-slice"
import { Input } from "../ui/input"
import { RootState } from "@/store"

type UserAttrForm = {
  rule: RuleGroup
  userType: string,
}

export const UserAttrList = [
  { key: '是否是VIP', value: 'user.wasVip' },
  { key: '创建时间', value: 'user.createdTime' },
  { key: '平台', value: 'platform' },
  { key: '用户系统', value: 'user.systemOs' },
  { key: '小程序类型', value: 'user.mpType' },
  { key: '用户ID', value: 'user.userId' },
  { key: '用户vip类型', value: 'type' }
]

export function RuleBuilderComponent({ setIsOpen, division }: {setIsOpen: (isOpen: boolean) => void, division?: PeoPleDivision}) {
  // const peopleDivisions = useSelector((state: RootState) => state.peopleDivisionState.peopleDivisions)
  const userTypeList = useSelector((state: RootState) => state.userTypeReducer.userTypeList)
  const dispatch = useDispatch()
  const update = division? true: false
  console.log('division gengxin', division)
  const initRule = division?.rule || { rule: [], logic: 'and' }
  const [rule, setRule] = useState<RuleGroup>(initRule)
  const [alert, setAlert] = useState(false)
  const [alertInfo, setAlertInfo] = useState('')
  const [userType, setUserType] = useState(division?.type || '')
  const handleRuleChange = (updatedRules: RuleGroup) => {
    setRule(updatedRules)
  }
  const { handleSubmit, control, reset } = useForm<UserAttrForm>({
    defaultValues: { rule, userType }
  })
  const onSubmit = ({ rule, userType }: UserAttrForm) => {
    if (userType === '' || rule.rule.length === 0 ) {
      userType === '' && setAlertInfo('请选择用户类型')
      rule.rule.length === 0 && setAlertInfo('请添加规则')
      setAlert(true)
      setTimeout(() => {
        setAlert(false)
      }, 2000)
      return
    }
    const name = userTypeList.findLast(item => item.value === userType)?.key as string
    const data = { name, rule, type: userType }
    update? dispatch(updatePeopleDivision(data)): dispatch(addPeopleDivision(data))
    setRule(initRule)
    setUserType('')
    // 重置表单数据
    setIsOpen(false)
    reset({
      rule: initRule,
      userType: ''
    })
  }
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col w-full space-y-4'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Controller
            control={control}
            name='rule'
            render={({ field }) => (
              <RuleGroupComponent
                group={rule}
                onChange={(updatedRule) => {
                  field.onChange(updatedRule)
                  handleRuleChange(updatedRule)
                }}
                userAttrList={UserAttrList}
              />
            )}
          />
          <div className='grid grid-cols-2'>
            <div className='flex space-x-4'>
              { update? 
                <Input disabled placeholder={division?.name} className=""/>:
                <Controller
                  control={control}
                  name='userType'
                  render={({ field }) => (
                    <Select onValueChange={(value) => {field.onChange(value); setUserType(value)} } >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="用户类型"/>
                      </SelectTrigger>
                      <SelectContent>
                        { userTypeList.map(({ key, value }, index) => (
                          <SelectItem key={index} value={value}>{key}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />  
              }
              {
                update? 
                  <Button className='bg-zinc-700' type='submit'>更新</Button>: 
                  <Button className='bg-zinc-700' type='submit'>提交</Button>
              }

            </div>
          </div>
        </form>
        {
          alert && <Alert variant="destructive">
            <ExclamationTriangleIcon  className="h-4 w-4" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{alertInfo}</AlertDescription>
          </Alert>
        }
      </div>
    </div>
  )
}
