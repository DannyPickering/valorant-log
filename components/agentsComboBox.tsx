"use client"

import React, { useState, useEffect } from "react"
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

import { ValorantAgent } from "@/types/collections"
import { getAllAgents } from "@/lib/supabase-queries"

interface AgentsComboBoxProps {
  onSelectAgent: (selectedAgent: ValorantAgent) => void;
}

export function AgentsComboBox({ onSelectAgent }: AgentsComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ValorantAgent>();
  const [valorantAgents, setValorantAgents] = useState<ValorantAgent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agentsData = await getAllAgents();
        if (agentsData != null) {
          setValorantAgents(agentsData);
        }
      } catch (error) {
        console.error('Error fetching agents: ', error);
      }
    };
    fetchData();
  }, []);


  const handleSelectAgent = (agent: ValorantAgent) => {
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
            ? value.name
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
                key={agent.id}
                onSelect={() => handleSelectAgent(agent)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === agent ? "opacity-100" : "opacity-0"
                  )}
                />
                {agent.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover >
  )
}
