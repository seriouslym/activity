
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

interface SortItemType {
    id: string;
    name: string;
}

const DraggableListNode = (props: SortItemType) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginTop: 8,
  }

  return (
    // <Card bordered style={style} ref={setNodeRef} {...attributes} {...listeners}>
    //   {props.name}
    // </Card>
    <Input ref={setNodeRef} value={props.name} {...attributes} {...listeners} style={style} className="w-[50%]"/>
  )
}

const ProductSortComponent= () => {

  return (
    <>
      <div className="space-y-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button>排序配置</Button>
          </DialogTrigger >
          <DialogContent className='min-w-[1000px]'>
            <SortStepComponent/>
          </DialogContent>
        </Dialog>
        
        <div className='border border-gray-400 rounded-lg flex'>
          
        </div>
        
      </div>
    </>
  )
}

export default ProductSortComponent



const SortComponent = () => {
  const data: SortItemType[] = [
    { id: '1', name: "列表项1" },
    { id: '2', name: "列表项2" },
    { id: '3', name: "列表项3" },
    { id: '4', name: "列表项4" },
  ]
  const [items, setItems] = useState(data)
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    console.log(active)
    console.log(over)
    if (active.id !== over?.id) {
      console.log("active", active.id)
      const activeIndex = items.findIndex((i) => i.id === active.id)
      const overIndex = items.findIndex((i) => i.id === over?.id)
      const newlist = arrayMove(items, activeIndex, overIndex)
      setItems(newlist)
    }
  }
  return <>
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
      <SortableContext
        items={items.map((i: SortItemType) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item: SortItemType) => (
          <DraggableListNode key={item.id} {...item} />
        ))}
      </SortableContext>
    </DndContext>
  </> 
}

const SortStepComponent = () => {
  const steps = [
    {
      title: '默认排序',
      content: <SortComponent/>
    },
    {
      title: '自定义排序',
      content: <SortComponent/>
    }
  ]
  const [current, setCurrent] = useState(0)
  const next = () => setCurrent(current + 1)
  const prev = () => setCurrent(current - 1)
  return <>
    <Steps items={steps} current={current}/>
    <div className="min-h-[150px]">{steps[current].content}</div>
  </>

}