import { PeoPleDivision } from "@/store/people-division-slice"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function PeopleDivisionTableComponent({ data }: {data: PeoPleDivision[]}) {
  return (
    <Table className='table-fixed'>
      <TableHeader>
        <TableRow>
          <TableHead className="">序号</TableHead>
          <TableHead>用户划分</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className=''>
        {data.map((invoice, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{invoice.name}</TableCell>
            <TableCell className='space-x-2'>
              <Button variant={'outline'}>编辑</Button>
              <Button variant={'destructive'}>删除</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
