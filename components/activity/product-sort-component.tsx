
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
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Steps } from "antd"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { ExtraSortConfig, SortConfig, updateDefaultSortSort, updateExtraSort } from "@/store/product-sort-slice"
import { Label } from "../ui/label"
import { Dot, Plus, X } from "lucide-react"
import { RuleGroup, RuleGroupComponent } from "../rule/rule-group-component"
import { UserAttrList } from "../rule/rule-builder"
import { checkRuleGroup } from "./activity-step-component"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

export type SortProductType = {
    id: string;
    name: string;
}

const DraggableListNode = ({ props, index, handleDeleteProduct }: {props:SortProductType, index: number, handleDeleteProduct: (index: number) => void}) => {
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
      <div className="grid grid-cols-12">
        <div className="col-span-6 flex items-center space-x-4">
          <Label className="text-gray-400">{index+1}</Label>
          <div className="flex justify-start items-center relative" ref={setNodeRef} {...attributes}  style={style}  >
            <Input value={props.name} className="pr-8" {...listeners}/>
            <X size={16} className="absolute right-2 " onClick={() => handleDeleteProduct(index)}/>
          </div>
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



export const SortComponent = ({ data, onSortChange, handleDeleteProduct }: {data: SortProductType[], onSortChange: (sortConfig: SortProductType[]) => void, handleDeleteProduct: (index: number) => void})  => {
  const [items, setItems] = useState(data)
  useEffect(() => {
    setItems(data)
  }, [data])
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = items.findIndex((i) => i.id === active.id)
      const overIndex = items.findIndex((i) => i.id === over?.id)
      const newlist = arrayMove(items, activeIndex, overIndex)
      setItems(newlist)
      onSortChange(newlist)
    }
  }
  return <>
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
      <SortableContext
        items={items.map((i: SortProductType) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item: SortProductType, index) => (
          <DraggableListNode key={item.id} props={item} index={index} handleDeleteProduct={handleDeleteProduct}/>
        ))}
      </SortableContext>
    </DndContext>
  </> 
}

const SortStepComponent = ({ props, closeDialogCb }: {props: Omit<SortConfig, 'name'>, closeDialogCb: Function}) => {
  const dispatch = useDispatch()
  const userDefinedSortRef = useRef<{getExtraSortConfig: () => ExtraSortConfig[]}>(null)
  const [alert, setAlert] = useState<string>('')
  const steps = [
    {
      title: '默认排序',
      content: <SortComponent 
        data={props.defaultSort} 
        onSortChange={(sortConfig: SortProductType[]) => dispatch(updateDefaultSortSort(sortConfig))}
        handleDeleteProduct={(index: number) => {
          const newSort = props.defaultSort.filter((_, i) => i !== index)
          dispatch(updateDefaultSortSort(newSort))
        }}
      />
    },
    {
      title: '自定义排序',
      content: <UserDefinedSortComponent data={{ extraSort: props.extraSort }} ref={userDefinedSortRef}/>
    }
  ]
  const [current, setCurrent] = useState(0)
  const next = () => setCurrent(current + 1)
  const prev = () => setCurrent(current - 1)
  const handleSortSubmit = () => {
    const uds = userDefinedSortRef.current?.getExtraSortConfig()
    console.log('uds', uds)
    if (uds === undefined || uds.length === 0) {
      dispatch(updateExtraSort([]))
      closeDialogCb(false)
      return
    }
    for (let item of uds) {
      if(!checkRuleGroup(item.extraRule)) {
        setAlert('请完善规则配置')
        setTimeout(() => {
          setAlert('')
        }, 2000)
        return
      }
    }
    dispatch(updateExtraSort(uds))
    closeDialogCb(false)
  }
  return <>
    <Steps items={steps} current={current}/>
    <div className="min-h-[150px]">{steps[current].content}</div>
    <div>
      {alert && 
      <Alert variant="destructive" className="w-[30%]">
        <ExclamationTriangleIcon  className="h-4 w-4" />
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription>{alert}</AlertDescription>
      </Alert>
      }
    </div>
    <div className="flex justify-end space-x-4">
      {current > 0 && (
        <Button className="bg-zinc-700" onClick={() => prev()}>上一步</Button>
      )}
      {current < steps.length - 1 && (
        <Button className="bg-zinc-700" onClick={() => next()}>下一步</Button>
      )}
      {
        current === steps.length - 1 && (
          <Button className="bg-zinc-700" onClick={handleSortSubmit}>提交</Button>
        )
      }
    </div>
  </>

}



const UserDefinedSortComponent = forwardRef(({ data }: {data: Pick<SortConfig, 'extraSort'>}, ref) =>{
  const [extraSortConfig, setExtraSortConfig] = useState<ExtraSortConfig[]>(data.extraSort)
  useImperativeHandle(ref, () => ({
    getExtraSortConfig: () => extraSortConfig,
  }))
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
  const deleteExtraConfig = (index: number) => {
    setExtraSortConfig(extraSortConfig.filter((_, i) => i !== index))
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
          
            <div key={index} className="border border-gray-400 rounded-lg p-4 w-[600px] space-y-4 relative"> 
              <div className="absolute right-0 top-0" onClick={() => deleteExtraConfig(index)}>
                <X size={24}/>
              </div>
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
                <SortComponent 
                  data={config.extraSort} 
                  onSortChange={(sortConfig: SortProductType[]) => updateSort(sortConfig, index)}
                  handleDeleteProduct={(idx: number) => {
                    setExtraSortConfig(extraSortConfig.map((config, i) => {
                      if (i === index) {
                        return {
                          ...config,
                          extraSort: config.extraSort.filter((_, j) => j !== idx)
                        }
                      }
                      return config
                    }))
                  }}
                /> 
              </div>
            </div>
          </>
        ))
      }
    </div>
  
  </>
})

UserDefinedSortComponent.displayName = 'UserDefinedSortComponent'


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
                <SortStepComponent props={sortConfig} closeDialogCb={setIsOpen}/>
              </DialogContent>
            </Dialog>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}