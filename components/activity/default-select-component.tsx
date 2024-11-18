import { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"

export default function DefaultSelectComponent() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div className="space-y-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>新增</Button>
          </DialogTrigger>
          <DialogContent className='min-w-[1000px]'>
            
          </DialogContent>
        </Dialog>
        
        <div className='border border-gray-400 rounded-lg flex'>
          
        </div>
        
      </div>
    </>
   
  )
}


const DefaultSelectTableComponent = () => {
  
}