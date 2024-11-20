'use client'
import Activity from "@/components/activity"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RootState } from "@/store"
import { deleteActivityCompleteInfo } from "@/store/activity-complete-info-slice"
import { ActivityItem, clearActivityItem, setActivityItem } from "@/store/activity-config-slice"
import { PeoPleDivision, clearPeopleDivision, setPeopleDivision } from "@/store/people-division-slice"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function Home() {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const addActivity = () => {
    dispatch(clearActivityItem())
    dispatch(clearPeopleDivision())
    setOpen(true)
  }
  return (
    <div className="h-screen">
      {/* <Provider store={store}> */}
      <div className="grid grid-cols-12 gap-2 h-full">
        <div className="col-span-2"></div>
        <div className="col-span-10">
          <div className="space-y-2 px-16 py-16">
            <div className="flex justify-end">
              <Dialog open={open} onOpenChange={setOpen}>
                <Button onClick={addActivity}>添加活动</Button>
                <DialogContent className="flex justify-center items-center min-w-[600px] ">
                  <Activity setIsOpen={setOpen}/>
                </DialogContent>
              </Dialog>
            </div>
            <ActivitiesTableComponent/>
          </div>
        </div>
      </div>
      {/* </Provider>     */}
    </div>
  )
}




const ActivitiesTableComponent = () => {
  const activities = useSelector((state: RootState) => state.activityCompleteInfoState.activityCompleteInfos)
  const dispatch = useDispatch()
  // 编辑活动弹窗
  const [open, setOpen] = useState(false)
  const editActivity = (activityItem: ActivityItem[], peopleDivision: PeoPleDivision[]) => {
    // 设置全局store中的数据
    dispatch(setActivityItem(activityItem))
    dispatch(setPeopleDivision(peopleDivision))
    setOpen(true)
  }
  const deleteActivity = (index: number) => {
    dispatch(deleteActivityCompleteInfo(index))
  }
  return <>
    <div >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>序号</TableHead>
            <TableHead>活动名称</TableHead>
            <TableHead>开始时间</TableHead>
            <TableHead>结束时间</TableHead>
            <TableHead>相关活动</TableHead>
            <TableHead className="flex justify-center items-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            activities.length? activities.map((activity, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{activity.name}</TableCell>
                <TableCell>{activity.startTime}</TableCell>
                <TableCell>{activity.endTime}</TableCell>
                <TableCell>{1}</TableCell>
                <TableCell className="space-x-4 flex justify-center items-center">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <Button onClick={() => editActivity(activity.activityItems, activity.peopleDivision)}>编辑</Button>
                    <DialogContent className="flex justify-center items-center min-w-[600px] ">
                      <Activity setIsOpen={setOpen} index={index} name={activity.name}  startTime={activity.startTime} endTime={activity.endTime}/>
                    </DialogContent>
                  </Dialog>
                  <Button variant='outline' onClick={() => deleteActivity(index)}>删除</Button>
                  <Button variant='destructive'>发布</Button>
                </TableCell>
              </TableRow>
            )): <TableRow>
              <TableCell colSpan={6} className=" h-16 text-center">暂无数据</TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>

      <pre>
        {JSON.stringify(activities, null, 2)}
      </pre>
    </div>
  </>
}