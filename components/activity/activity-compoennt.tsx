import { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import ActivityStepComponent from "./activity-step-component"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { ActivityItem, deleteActivityItem } from "@/store/activity-config-slice"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"

export default function ActivityComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const activityItems = useSelector((state: RootState) => state.activityConfigState.activityItems)
  return (
    <>
      <div className="space-y-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>新增</Button>
          </DialogTrigger >
          <DialogContent className='min-w-[1000px]'>
            <ActivityStepComponent props={{ setIsOpen }}/>
          </DialogContent>
        </Dialog>
        
        <div className='border border-gray-400 rounded-lg flex'>
          <ActivityTableComponent data={activityItems}/>
        </div>
        
      </div>
    </>
   
  )
}




function ActivityTableComponent({ data }: {data: ActivityItem[]}) {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAct, setSelectedAct] = useState<ActivityItem>()
  return (
    <Table className='table-fixed'>
      <TableHeader>
        <TableRow>
          <TableHead>序号</TableHead>
          <TableHead>活动名称</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className=''>
        {data.length? data.map((activity, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{activity.name}</TableCell>
            <TableCell className='space-x-2'>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant={'outline'} onClick={() => {setSelectedAct(activity); setIsOpen(true)}}>编辑</Button>
                </DialogTrigger>
                <DialogContent className='min-w-[1000px]'>
                  <ActivityStepComponent props={{ setIsOpen, index, ...selectedAct }}/>
                </DialogContent>
              </Dialog>
              <Button variant={'destructive'} onClick={() => dispatch(deleteActivityItem(index))}>删除</Button>
            </TableCell>
          </TableRow>
        )): <TableRow className="h-16"><TableCell colSpan={3} className="text-center">暂无数据</TableCell></TableRow>}
      </TableBody>
    </Table>
  )
}