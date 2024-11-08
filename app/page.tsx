'use client'
import Activity from "@/components/activity"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import store, { RootState } from "@/store"
import { useState } from "react"
import { Provider, useSelector } from "react-redux"

export default function Home() {
  const [open, setOpen] = useState(false)
  return (
    <div className="h-screen">
      <Provider store={store}>
        <div className="grid grid-cols-12 gap-2 h-full">
          <div className="col-span-2"></div>
          <div className="col-span-10">
            <div className="space-y-2 px-16 py-16">
              <div className="flex justify-end">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger>
                    <Button>添加活动</Button>
                  </DialogTrigger>
                  <DialogContent className="flex justify-center items-center min-w-[600px] ">
                    <Activity setIsOpen={setOpen}/>
                    {/* <div>1</div> */}
                  </DialogContent>
                </Dialog>
              </div>
              <ActivitiesTableComponent/>
            </div>
          </div>
        </div>
      </Provider>    
    </div>
  )
}




const ActivitiesTableComponent = () => {
  const activities = useSelector((state: RootState) => state.activityCompleteInfoState.activityCompleteInfos)
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
            <TableHead>操作</TableHead>
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
                <TableCell>
                  <Button variant='outline' onClick={() => {console.log(activities)}}>编辑</Button>
                  <Button variant='outline'>删除</Button>
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