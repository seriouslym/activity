
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import * as React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Steps } from "antd"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { ExtraSortConfig, updateDefaultSortSort } from "@/store/product-sort-slice"
import { Label } from "../ui/label"
import { Dot, Plus } from "lucide-react"
import { RuleGroup, RuleGroupComponent } from "../rule/rule-group-component"
import { UserAttrList } from "../rule/rule-builder"

export type SortProductType = {
    id: string;
    name: string;
}

const DraggableListNode = ({ props, index }: {props:SortProductType, index: number}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginTop: 8,
  }
  return (
    <>
      <div className="grid grid-cols-12 items-center">
        <div className="col-span-6 flex items-center space-x-4">
          <Label className="text-gray-400">{index}</Label>
          <Input ref={setNodeRef} value={props.name} {...attributes} {...listeners} style={style} className=""/>
        </div>
      </div>
    </>
  )
}

const ProductSortComponent= () => {

  return (
    <>
      <div className="space-y-2">
      
        <div className='border border-gray-400 rounded-lg flex'>
          <SortTableComponent/>
        </div>
        
      </div>
    </>
  )
}

export default ProductSortComponent



const SortComponent = ({ data, onSortChange }: {data: SortProductType[], onSortChange: (sortConfig: SortProductType[]) => void}) => {
  const [items, setItems] = useState(data)
  const sortConfig = useSelector((state: RootState) => state.productSortReducer.sortConfig)
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    console.log(active)
    console.log(over)
    if (active.id !== over?.id) {
      console.log("active", active.id)
      const activeIndex = items.findIndex((i) => i.id === active.id)
      const overIndex = items.findIndex((i) => i.id === over?.id)
      const newlist = arrayMove(items, activeIndex, overIndex)
      setItems(newlist)
      onSortChange(newlist)
      console.log('yuan', sortConfig, 'xin', newlist)
    }
  }
  return <>
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
      <SortableContext
        items={items.map((i: SortProductType) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item: SortProductType, index) => (
          <DraggableListNode key={item.id} props={item} index={index+1}/>
        ))}
      </SortableContext>
    </DndContext>
  </> 
}

const SortStepComponent = ({ props }: {props: SortProductType[]}) => {
  const dispatch = useDispatch()
  const steps = [
    {
      title: '默认排序',
      content: <SortComponent data={props} onSortChange={(sortConfig: SortProductType[]) => dispatch(updateDefaultSortSort(sortConfig))}/>
    },
    {
      title: '自定义排序',
      content: <UserDefinedSortComponent/>
    }
  ]
  const [current, setCurrent] = useState(0)
  const next = () => setCurrent(current + 1)
  const prev = () => setCurrent(current - 1)
  return <>
    <Steps items={steps} current={current}/>
    <div className="min-h-[150px]">{steps[current].content}</div>
    <div className="flex justify-end space-x-4">
      {current > 0 && (
        <Button className="bg-zinc-700" onClick={() => prev()}>上一步</Button>
      )}
      {current < steps.length - 1 && (
        <Button className="bg-zinc-700" onClick={() => next()}>下一步</Button>
      )}
      {
        current === steps.length - 1 && (
          <Button className="bg-zinc-700" onClick={console.log}>提交</Button>
        )
      }
    </div>
  </>

}



function UserDefinedSortComponent() {
  const [extraSortConfig, setExtraSortConfig] = useState<ExtraSortConfig[]>([])
  const extraRule: RuleGroup = { logic: 'and', rule: [] }
  // 使用第一个排序配置的默认排序
  const extraSort = useSelector((state: RootState) => state.productSortReducer.sortConfig).defaultSort
  const addExtraSortConfig = () => {
    setExtraSortConfig([...extraSortConfig, { extraRule, extraSort }])
  }
  const updateRule = (updatedRule: RuleGroup, index: number) => {
    setExtraSortConfig(extraSortConfig.map((config, i) => {
      if (i === index) {
        return {
          ...config,
          extraRule: updatedRule
        }
      }
      return config
    }))
  }
  const updateSort = (sortConfig: SortProductType[], index: number) => {
    setExtraSortConfig(extraSortConfig.map((config, i) => {
      if (i === index) {
        return {
          ...config,
          extraSort: sortConfig
        }
      }
      return config
    }))
  }
  return <>
    <div className="flex items-center space-x-4"> 
      <Label>自定义排序</Label>
      <div className="rounded-full bg-zinc-700" onClick={addExtraSortConfig}>
        <Plus size={16} className="text-white"/>
      </div>
    </div>
    <div className="max-h-[400px] overflow-auto space-y-8 mt-4">
      {
        extraSortConfig.map((config, index) => (
          <>
          
            <div key={index} className="border border-gray-400 rounded-lg p-4 w-[600px] space-y-4"> 
              <Label className="font-bold text-lg">{`配置${index+1}`}</Label>
              <div className="">
                <div className="flex w-[70%]">
                  <Dot size={32}/>
                  <div className="flex-1">
                    <RuleGroupComponent
                      group={config.extraRule}
                      onChange={(updatedRule) => updateRule(updatedRule, index)}
                      userAttrList={UserAttrList}
                    />
                  </div>
                </div>
                <SortComponent data={config.extraSort} onSortChange={(sortConfig: SortProductType[]) => updateSort(sortConfig, index)}/>
                  
              </div>
            </div>
          </>
        ))
      }
    </div>
  
  </>
}



function SortTableComponent() {
  const sortConfig = useSelector((state: RootState) => state.productSortReducer.sortConfig)
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Table className='table-fixed'>
      <TableHeader>
        <TableRow>
          <TableHead>序号</TableHead>
          <TableHead>排序配置名称</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className=''>
        
        <TableRow key={1}>
          <TableCell className="font-medium">{1}</TableCell>
          <TableCell>{sortConfig.name}</TableCell>
          <TableCell className='space-x-2'>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant={'outline'}>编辑</Button>
              </DialogTrigger>
              <DialogContent className='min-w-[1000px]'>
                <SortStepComponent props={sortConfig.defaultSort}/>
              </DialogContent>
            </Dialog>
            <Button variant={'destructive'} onClick={() => console.log(1)}>删除</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}