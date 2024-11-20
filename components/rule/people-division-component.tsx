'use client'
import { PeoPleDivision, deletePeopleDivision } from "@/store/people-division-slice"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { RuleBuilderComponent } from "@/components/rule/rule-builder"
import { RootState } from "@/store"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { addUserType } from "@/store/user-type-slice"

function PeopleDivisionTableComponent({ data }: {data: PeoPleDivision[]}) {
  const peopleDivisions = useSelector((state: RootState) => state.peopleDivisionState.peopleDivisions)
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDivision, setSelectedDivision] = useState<PeoPleDivision|undefined>(undefined)
  const handleEditClick = (division: PeoPleDivision) => {
    setSelectedDivision(division) // 设置当前需要编辑的division
    setIsOpen(true)
  }

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
                <DialogTrigger >
                  <Button variant={'outline'} onClick={() => handleEditClick(division)}>编辑</Button>
                </DialogTrigger>
                <DialogContent>
                  <RuleBuilderComponent division={selectedDivision} setIsOpen={setIsOpen}/>
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
  const userTypeList = useSelector((state: RootState) => state.userTypeReducer.userTypeList)
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [userTypeOpen, setUserTypeOpen] = useState(false)
  const { register, handleSubmit, formState: { errors }, setError } = useForm<{key: string, value: string}>({
    defaultValues: { key: '', value: '' },
    resolver: zodResolver(z.object({
      key: z.string().nonempty('名称不能为空'),
      value: z.string().nonempty('属性不能为空')
    }))
  })
  const addUserDefinedType = (data: {key: string, value: string}) => {
    console.log(data)
    if (userTypeList.some(item => item.key === data.key)) {
      setError('key', { message: '名称已存在', type: 'required' })
      return
    }
    dispatch(addUserType(data))
    setUserTypeOpen(false)
  }
  return (
    <>
      <div className="space-y-2">
        <div className="flex justify-start space-x-8">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>新增</Button>
            </DialogTrigger >
            <DialogContent className=' min-w-[700px]'>
              <RuleBuilderComponent setIsOpen={setIsOpen}/>
            </DialogContent>
          </Dialog>
          <Popover open={userTypeOpen} onOpenChange={setUserTypeOpen}>
            <PopoverTrigger>
              <Button>自定义类别</Button>
            </PopoverTrigger>
            <PopoverContent side="right">
              <form onSubmit={handleSubmit(addUserDefinedType)}>
                <div className="grid gap-5">
                  <div className="grid grid-cols-4 items-center">
                    <Label>名称</Label>
                    <Input className="col-span-3" {...register('key')}/>
                    {errors.key && <p className="text-red-500 text-sm col-span-4 ">{errors.key.message}</p>}
                  </div>
                  <div className="grid grid-cols-4 items-center">
                    <Label>属性</Label>
                    <Input className="col-span-3" {...register('value')}/>
                    {errors.value && <p className="text-red-500 text-sm col-span-4 ">{errors.value.message}</p>}
                  </div>
                  <Button type="submit">保存</Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </div>
        <div className='border border-gray-400 rounded-lg flex'>
          <PeopleDivisionTableComponent data={peopleDivisions}/>
        </div> 
        
      </div>
    </>
  )
}
