"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { valorantMaps } from "@/lib/static-valorant-data"

interface MapsComboBoxProps {
  onSelectMap: (selectedMap: string) => void;
}

export function MapsComboBox({ onSelectMap }: MapsComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleSelectMap = (map: string) => {
    setValue(map);
    setOpen(false);
    onSelectMap(map);
  }

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
            ? valorantMaps.find((map) => map === value)
            : "Select a map"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search maps..." />
          <CommandEmpty>No map found.</CommandEmpty>
          <CommandGroup>
            {valorantMaps.map((map) => (
              <CommandItem
                key={map}
                onSelect={() => handleSelectMap(map)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === map ? "opacity-100" : "opacity-0"
                  )}
                />
                {map}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover >
  )
}
