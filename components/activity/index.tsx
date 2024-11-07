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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Input } from "../ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"
import { addActivityCompleteInfo } from "@/store/activity-complete-info-slice"
import { useRouter } from "next/navigation"

const ActivityBasicInfoFormSchema = z.object({
  name: z.string({
    required_error: '请输入活动名称',
  }).min(2, '活动名称最少2个字符'),
  startTime: z.string().date('请输入正确的时间格式'),
  endTime: z.string().date('请输入正确的时间格式'),
})
type FormValues = z.infer<typeof ActivityBasicInfoFormSchema>

export default function Activity() {
  const peopleDivisionState = useSelector((state: RootState) => state.peopleDivisionState.peopleDivisions)
  const activityItems = useSelector((state: RootState) => state.activityConfigState.activityItems)
  const dispath = useDispatch()
  const [alert, setAlert] = useState(false)
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(ActivityBasicInfoFormSchema)
  })
  const router = useRouter()

  const onActivityBasicInfosubmit = (data: FormValues) => {
    console.log('huodong xinixn', data)
    dispath(addActivityCompleteInfo({
      peopleDivision: peopleDivisionState,
      activityItems: activityItems,
      ...data
    }))
    setOpen(false)
    // 跳转到/activity页面
    router.push('/activities')
  }
  const handleSaveActivity = () => {
    if (!activityItems.length) {
      setAlert(true)
      setTimeout(() => setAlert(false), 2000)
      return
    }
    setOpen(true)
  }
  return <>
    <div className="flex flex-col justify-center items-center h-screen ">
      <Card className="relative w-[600px] h-[700px] bg-zinc-100 overflow-auto">
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
            
          </div>
          <div className="absolute right-8 bottom-8">
            <Dialog open={open} onOpenChange={setOpen}>
              <Button onClick={handleSaveActivity}>提交</Button>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(onActivityBasicInfosubmit)}>
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
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
      
  </>
}

