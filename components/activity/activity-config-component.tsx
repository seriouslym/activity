import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "../ui/dropdown-menu"
import { Plus, Dot, X, Check } from "lucide-react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export type ActProp = {
  label: string // 展示
  key: string // 字段
  value: string //  输入的值
} 
type ActConfigProp = {
  acts: ActProp[],
  name: string,
  setActs: Function
}


const activityList: (activity)[] = [
  { label: '商品', submenus: [
    { label: '半年VIP', value: '11', key: 'productId', },
    { label: '一年VIP', value: '22', key: 'productId', },
    { label: '两年VIP', value: '33', key: 'productId', },
    { label: '三年VIP', value: '44', key: 'productId', },
    { label: 'SVIP', value: '55', key: 'productId', },
  ] },
  { label: '商品头部标签', key: 'overHeadTag' },
  { label: '折合价', key: 'titleByYear', },
  { label: '折合价单位', key: 'period', },
  { label: '支付标签', key: 'buttonTag', },
  { label: '赠送天数', submenus: [
    { label: 'vip赠送天数', key: 'gift', },
    { label: 'svip赠送天数', key: 'gift', },
    { label: '团队版赠送天数', key: 'gift', }
  ] },
  { label: '文案描述', submenus: [
    { label: 'vip文案配置', submenus: [
      { label: 'vip配置1', key: 'vip.title' },
      { label: 'vip配置2', key: 'vip.text' },
    ] },
    { label: '团队版文案配置', key: 'team.text' },
  ] },
]

export default function ActConfig({ acts, name, setActs }: ActConfigProp){
  const handleInputChange = (index: number, value: string) => {
    const newActs = [...acts]
    newActs[index].value = value
    setActs(newActs)
  }

  const handleDeleteActConfig = (index: number) => {
    const newBaseAct = [...acts]
    newBaseAct.splice(index, 1)
    setActs(newBaseAct)
  }

  const handleAddActConfig = (act: ActProp) => {
    setActs([...acts, act])
  }
  return <div className="space-y-2">
    <div className="flex items-center space-x-4"> 
      <Label>{name}</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="rounded-full bg-zinc-700">
            <Plus size={16} className="text-white"/>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-40">
          {renderMenu(activityList, handleAddActConfig)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div className={cn(acts.length !== 0? 'border border-gray-400 rounded-lg bg-gray-100 ': '', 'flex flex-col justify-start')}>
      <ul className="space-y-2 my-4">
        {
          acts.map((item, index) => (
            <li key={index} className="mx-4">
              <div className="flex items-center text-nowrap my-1 border border-gray-300 rounded-md relative">
                <div className="w-[150px] items-center text-center inline-flex h-12">
                  <Dot size={32}/>
                  <Label>{`${item.label}`}</Label>
                </div>
                { item.key === 'productId' ? (
                  <Input className='w-48 border border-black' value={item.value} disabled ></Input>
                ): (
                  <Input className='w-48 border border-black ' placeholder="请配置活动元素的值" value={item.value} onChange={(e: any) => {handleInputChange(index, e.target.value)}}required></Input>
                )}
                <button className='absolute right-0 top-1 text-zinc-500' type='button' onClick={() => handleDeleteActConfig(index)}>
                  <X size={20}/>
                </button>
              </div>
            </li>
          ))
        }
            
      </ul>
      {
        acts.length !== 0 && 
        <div className="flex justify-end mr-4 mb-4">
          <button className="">
            <Check size={16} />
          </button>
        </div>
      }
    </div>
  </div>
  
}


type activity = {
  label: string
  key?: string
  value?: string
  submenus?: activity[]
}

const renderMenu = (menuItems: activity[], handleAddBaseActivity: Function) => {
  return menuItems.map((item, index) => {
    if (item.submenus && item.submenus.length > 0) {
      return (
        <DropdownMenuSub key={index}>
          <DropdownMenuSubTrigger >{item.label}</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-36">
              { renderMenu(item.submenus, handleAddBaseActivity) }
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      )
    }
    return (
      <>
        <DropdownMenuItem key={index} onSelect={(_e) => {handleAddBaseActivity({ label: item.label, key: item.key, value: item.value })}}>
          {item.label}
          <div className="rounded-full bg-zinc-700 absolute right-2">
            <Plus size={16} className="text-white"/>
          </div>
        </DropdownMenuItem>
        { index !== menuItems.length - 1 && <DropdownMenuSeparator/>}
      </>
    )
  })
}