'use client'
import { PeoPleDivision, deletePeopleDivision } from "@/store/people-division-slice"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { RuleBuilderComponent } from "@/components/rule/rule-builder"
import { RootState } from "@/store"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"

function PeopleDivisionTableComponent({ data }: {data: PeoPleDivision[]}) {
  const peopleDivisions = useSelector((state: RootState) => state.peopleDivisionState.peopleDivisions)
  const dispatch = useDispatch()
  console.log('---------', peopleDivisions)
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Table className='table-fixed'>
      <TableHeader>
        <TableRow>
          <TableHead className="">序号</TableHead>
          <TableHead>用户划分</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { data.length? data.map((division, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{division.name}</TableCell>
            <TableCell className='space-x-2'>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant={'outline'}>编辑</Button>
                </DialogTrigger>
                <DialogContent>
                  <RuleBuilderComponent division={division} setIsOpen={setIsOpen}/>
                </DialogContent>
              </Dialog>
              <Button variant={'destructive'} onClick={() => dispatch(deletePeopleDivision(index))}>删除</Button>
            </TableCell>
          </TableRow>
        )): <TableRow className="h-16"><TableCell colSpan={3} className="text-center">暂无数据</TableCell></TableRow>}
      </TableBody>
    </Table>
  )
}


export default function PeopleDivisionComponent() {
  const peopleDivisions = useSelector((state: RootState) => state.peopleDivisionState.peopleDivisions)
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div className="space-y-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>新增划分</Button>
          </DialogTrigger >
          <DialogContent className=' min-w-[700px]'>
            <RuleBuilderComponent setIsOpen={setIsOpen}/>
          </DialogContent>
        </Dialog>
        
        <div className='border border-gray-400 rounded-lg flex'>
          <PeopleDivisionTableComponent data={peopleDivisions}/>
        </div> 
        
      </div>
    </>
  )
}
