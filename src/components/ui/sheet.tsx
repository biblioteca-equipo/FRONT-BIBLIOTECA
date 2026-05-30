import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger

export function SheetContent({
  className = "",
  side = "left",
  children,
  ...props
}: DialogPrimitive.DialogContentProps & { side?: "left" | "right" }) {
  const position = side === "right" ? "right-0" : "left-0"

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content
        className={`fixed top-0 z-50 h-full w-72 border bg-background p-6 shadow-lg ${position} ${className}`}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4">
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
