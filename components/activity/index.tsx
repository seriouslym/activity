'use client'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import PeopleDivisionComponent from "../rule/people-division-component"
import ActivityComponent from "./activity-compoennt"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { useState } from "react"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Input } from "../ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"
import { addActivityCompleteInfo, updateActivityCompleteInfo } from "@/store/activity-complete-info-slice"
import { clearActivityItem } from "@/store/activity-config-slice"
import { clearPeopleDivision } from "@/store/people-division-slice"
import ProductSortComponent from "./product-sort-component"

const ActivityBasicInfoFormSchema = z.object({
  name: z.string({
    required_error: '请输入活动名称',
  }).min(2, '活动名称最少2个字符'),
  startTime: z.string().date('请输入正确的时间格式'),
  endTime: z.string().date('请输入正确的时间格式'),
})
type FormValues = z.infer<typeof ActivityBasicInfoFormSchema>

type ActivityProps = {
  setIsOpen: (isOpen: boolean) => void
  index?: number,
  name?: string,
  startTime?: string,
  endTime?: string
}

export default function Activity(props: ActivityProps) {
  const { setIsOpen, index } = props
  const dispath = useDispatch()
  const peopleDivisionState = useSelector((state: RootState) => state.peopleDivisionState.peopleDivisions)
  // 新增活动这里应该是没有数据的
  const activityItems = useSelector((state: RootState) => state.activityConfigState.activityItems)
  const [alert, setAlert] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(ActivityBasicInfoFormSchema)
  })
  const onActivitySubmit = (data: FormValues) => {
    if (!activityItems.length) {
      setAlert(true)
      setTimeout(() => setAlert(false), 2000)
      return
    }
    dispath(addActivityCompleteInfo({
      peopleDivision: peopleDivisionState,
      activityItems: activityItems,
      ...data
    }))
    dispath(clearActivityItem())
    dispath(clearPeopleDivision())
    setIsOpen(false)
  }

  const onActivitySave = (data: FormValues) => {
    if (!activityItems.length) {
      setAlert(true)
      setTimeout(() => setAlert(false), 2000)
      return
    }
    dispath(updateActivityCompleteInfo({
      index: index as number,
      peopleDivision: peopleDivisionState,
      activityItems: activityItems,
      ...data
    }))
    dispath(clearActivityItem())
    dispath(clearPeopleDivision())
    setIsOpen(false)
  }
  return <>
    {/* <div className="flex flex-col justify-center items-center"> */}
    <Card className="w-[600px] h-[700px] overflow-auto">
      <CardHeader>
        <CardTitle>活动配置页</CardTitle>
        <CardDescription>人群划分+活动元素配置</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-16">

          <div className="flex flex-col space-y-4">
            <Label>1、人群划分配置（可选）</Label>
            <PeopleDivisionComponent/>
          </div>
          <div className="flex flex-col space-y-4">
            <Label>2、配置活动信息</Label>
            <ActivityComponent/>
            { alert ? 
              <Alert variant="destructive">
                <ExclamationTriangleIcon  className="h-4 w-4" />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>请添加活动信息</AlertDescription>
              </Alert>: <></>
            }
          </div>
          
          <div className="flex flex-col space-y-4">
            <Label>3、商品排序</Label>
            <ProductSortComponent/>
          </div>

          <div className="flex flex-col space-y-4">
            <Label>5、活动基本信息</Label>
            <form onSubmit={index===undefined? handleSubmit(onActivitySubmit): handleSubmit(onActivitySave)}>
              <div className="grid gap-4">
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label>名称</Label>
                  <Input placeholder="10月活动" className="col-span-4" defaultValue={props.name} {...register('name')}
                  />
                  {errors.name && <p className="text-red-500 text-sm col-span-4 ">{errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label>开始时间</Label>
                  <Input placeholder="按如下格式填写 2024-09-01 12:00:00" className="col-span-4" {...register('startTime')} defaultValue={props.startTime}/>
                  {errors.startTime && <p className="text-red-500 text-sm col-span-4">{errors.startTime.message}</p>}
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label>结束时间</Label>
                  <Input placeholder="按如下格式填写 2024-09-12 12:00:00" className="col-span-4" {...register('endTime')} defaultValue={props.endTime}/>
                  {errors.endTime && <p className="text-red-500 text-sm col-span-4 ">{errors.endTime.message}</p>}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                {
                  index === undefined? <Button type="submit">提交</Button> : <Button type="submit">更新</Button>
                }
              </div>
            </form>
          </div>
            
        </div>
        {/* <div className="flex justify-end pt-4"> */}
        {/* <Button type="submit">提交</Button> */}
        {/* <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit(onActivityBasicInfoSubmit)}>
                <DialogHeader>
                  <DialogTitle>编辑活动基本信息</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">名称</Label>
                    <Input
                      placeholder="10月活动"
                      className="col-span-3"
                      {...register('name')}
                    />
                    {errors.name && 
                      <div className="text-red-500 text-sm col-span-4 ">
                        <Label className=" pl-12">{errors.name.message}</Label>
                      </div>
                    }
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">开始时间</Label>
                    <Input placeholder="按如下格式填写 2024-09-01 12:00:00" className="col-span-3" {...register('startTime')}/>
                    {errors.startTime && <p className="text-red-500 text-sm col-span-4 pl-12">{errors.startTime.message}</p>}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">结束时间</Label>
                    <Input  placeholder="按如下格式填写 2024-09-12 12:00:00" className="col-span-3" {...register('endTime')}/>
                    {errors.endTime && <p className="text-red-500 text-sm col-span-4 pl-12">{errors.endTime.message}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">保存活动信息</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog> */}
        {/* </div> */}
      </CardContent>
    </Card>
    {/* </div> */}
      
  </>
}

