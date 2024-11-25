import { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useDispatch, useSelector } from "react-redux"
import { DefaultSelectType, addDefaultSelect, updateDefaultSelect } from "@/store/default-select-slice"
import { RootState } from "@/store"
import { RuleGroup, RuleGroupComponent } from "../rule/rule-group-component"
import { UserAttrList } from "../rule/rule-builder"
import { Dot } from "lucide-react"
import { SortComponent, SortProductType } from "./product-sort-component"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { checkRuleGroup } from "./activity-step-component"
import React from "react"
import { cn } from "@/lib/utils"
import { Input } from "../ui/input"
import { productIDS } from "./activity-config-component"

export default function DefaultSelectComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const defaultSelects = useSelector((state: RootState) => state.defaultSelectReducer.defaultSelectSlice)
  return (
    <>
      <div className="space-y-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>新增</Button>
          </DialogTrigger>
          <DialogContent className='min-w-[700px] min-h-[400px]'>
            <DefaultSelectDialogComponent setIsopen = {setIsOpen}/>
          </DialogContent>
        </Dialog>
        
        <div className='border border-gray-400 rounded-lg flex'>
          <DefaultSelectTableComponent data={defaultSelects}/>
        </div>
        
      </div>
    </>
   
  )
}


const DefaultSelectTableComponent = ({ data }: {data: DefaultSelectType[]}) => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<DefaultSelectType>()
  const handleEditClick = (defaultSelect: DefaultSelectType) => {
    setSelected(defaultSelect)
    setIsOpen(true)
  }
  return (
    <Table className='table-fixed'>
      <TableHeader>
        <TableRow>
          <TableHead className="">序号</TableHead>
          <TableHead>名称</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { data.length? data.map((defaultSelect, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{defaultSelect.name}</TableCell>
            <TableCell className='space-x-2'>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger >
                  <Button variant={'outline'} onClick={() => handleEditClick(defaultSelect)}>编辑</Button>
                </DialogTrigger>
                <DialogContent className='min-w-[700px] min-h-[400px]'>
                  <DefaultSelectDialogComponent {...selected} index={index} setIsopen={setIsOpen}/>
                </DialogContent>
              </Dialog>
              <Button variant={'destructive'} onClick={() => dispatch((index))}>删除</Button>
            </TableCell>
          </TableRow>
        )): <TableRow className="h-16"><TableCell colSpan={3} className="text-center">暂无数据</TableCell></TableRow>}
      </TableBody>
    </Table>
  )
}


type  DefaultSelectDialogComponentProps = Partial<DefaultSelectType> & { setIsopen: (isOpen: boolean) => void } & {index?: number}

const DefaultSelectDialogComponent = (props: DefaultSelectDialogComponentProps) => {
  const [rule, setRule] = useState<RuleGroup>(props.rule || { logic: 'and', rule: [] })
  const [selectProduct, setSelectProduct] = useState<SortProductType[]>(props.selectProduct || [])
  const [name, setName] = useState(props.name || '')
  const [alert, setAlert] = useState('')
  const peopleDivisions = useSelector((state: RootState) => state.peopleDivisionState.peopleDivisions)
  // 新增的用户划分
  const newUserAttrList = peopleDivisions.map(item => ({ key: item.name, value: item.type }))
  const dispath = useDispatch()
  const handleAddProduct = (product: SortProductType) => {
    if (selectProduct.some(p => p.id === product.id)) {
      setAlert('商品已存在')
      setTimeout(() => setAlert(''), 2000)
      return
    }
    setSelectProduct([...selectProduct, product])
  }
  const handleSortChange = (sortConfig: SortProductType[]) => {
    setSelectProduct(sortConfig)
  }
  const handleSubmit = () => {
    if (!checkRuleGroup(rule) || selectProduct.length === 0) {
      setAlert('请完善规则或商品默认选中配置')
      setTimeout(() => setAlert(''), 2000)
      return
    }
    dispath(addDefaultSelect({ name, rule, selectProduct }))
    props.setIsopen(false)
  }
  const handleUpdate = () => {
    if (!checkRuleGroup(rule) || selectProduct.length === 0) {
      setAlert('请完善规则或商品默认选中配置')
      setTimeout(() => setAlert(''), 2000)
      return
    }
    dispath(updateDefaultSelect({ name, rule, selectProduct, index: props.index as number }))
    props.setIsopen(false)
  }
  const handleDeleteProduct = (index: number) => {
    setSelectProduct(selectProduct.filter((_, i) => i !== index))
  }
  return (
    <div className="space-y-4 px-8">
      <div className="flex items-center w-[70%]">
        <Dot size={32}/>
        <Input placeholder="名称" value={name} onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className="flex w-[70%]">
        <Dot size={32}/>
        <div className="flex-1">
          <RuleGroupComponent group={rule} onChange={setRule} userAttrList={[ ...UserAttrList, ...newUserAttrList ]}/>
        </div>
      </div>
      <div className="flex">
        <Dot size={32}/>
        <div className="flex-1">
          <AddProductDropdown handleAddProduct={handleAddProduct}/>
          <SortComponent 
            data={selectProduct} 
            onSortChange={handleSortChange}
            handleDeleteProduct={handleDeleteProduct}
          />
          <div className={cn("text-red-500 pt-4 text-left text-sm h-2", alert? '': 'invisible')}>{alert}</div>
        </div>
      </div>
      <div className="flex justify-end">
        {
          props.index? <Button onClick={handleUpdate}>更新</Button>: <Button onClick={handleSubmit}>提交</Button>
        }
      </div>

    </div>
  )
}


const AddProductDropdown = ({ handleAddProduct }: {handleAddProduct: (product: SortProductType) => void}) => {
  const products: SortProductType[] = productIDS.map(item => ({ id: item.value, name: item.label }))
  return <>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>添加商品</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right">
        {
          products.map((product, index) => (
            <>
              <DropdownMenuItem key={index} onClick={() => handleAddProduct({ ...product })}>{product.name}</DropdownMenuItem>
              {index !== products.length - 1 && <DropdownMenuSeparator/>}
            </>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  </>
}