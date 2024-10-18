import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useCallback, useState } from "react"

interface ComboboxProps {
  comboboxData: { value: string; label: string }[];
  handleComboboxSelect: (currentValue: string) => void;
}

export function Combobox({
    comboboxData,
    handleComboboxSelect,
  }: ComboboxProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const handleSelect = useCallback((currentValue: string) => {
        const comboValue = currentValue === value ? "" : currentValue;
        setValue(comboValue)
        setOpen(false)
        handleComboboxSelect(comboValue)
      }, [value, handleComboboxSelect])


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? comboboxData.find((comboboxData) => comboboxData.value === value)?.label
            : "연도 선택"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="연도 검색" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {comboboxData.map((comboboxData) => (
                <CommandItem
                    key={comboboxData.value}
                    value={comboboxData.value}
                    onSelect={handleSelect}
                >
                    <Check
                        className={cn(
                        "mr-2 h-4 w-4",
                        value === comboboxData.value ? "opacity-100" : "opacity-0"
                        )}
                    />
                  {comboboxData.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
