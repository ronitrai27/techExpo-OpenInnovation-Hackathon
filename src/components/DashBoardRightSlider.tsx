import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LuAlignRight } from "react-icons/lu";
export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-all fixed bottom-10 right-10">
        <LuAlignRight className="text-2xl" />
      </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
         
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline" className="cursor-pointer">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
