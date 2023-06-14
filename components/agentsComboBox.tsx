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

import { FormControl } from "./ui/form"

import { valorantAgents } from "@/lib/static-valorant-data"

interface AgentsComboBoxProps {
  onSelectAgent: (selectedAgent: string) => void;
}

export function AgentsComboBox({ onSelectAgent }: AgentsComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleSelectAgent = (agent: string) => {
    setValue(agent);
    setOpen(false);
    onSelectAgent(agent);
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
            ? valorantAgents.find((agent) => agent === value)
            : "Select an Agent"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Agents..." />
          <CommandEmpty>No agent found.</CommandEmpty>
          <CommandGroup>
            {valorantAgents.map((agent) => (
              <CommandItem
                key={agent}
                onSelect={() => handleSelectAgent(agent)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === agent ? "opacity-100" : "opacity-0"
                  )}
                />
                {agent}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover >
  )
}
