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

import { getAllMaps, getCurrentSeason } from "@/lib/supabase-queries"
import { ValorantMap } from '@/types/collections';

interface MapsComboBoxProps {
  onSelectMap: (selectedMap: ValorantMap) => void;
}

export function MapsComboBox({ onSelectMap }: MapsComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ValorantMap | null>(null);
  const [valorantMaps, setValorantMaps] = useState<ValorantMap[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const mapsData = await getAllMaps();
        if (mapsData != null) {
          setValorantMaps(mapsData);
        }
      } catch (error) {
        console.error('Error fetching maps: ', error);
      }
    };
    fetchData();
  }, []);

  const handleSelectMap = (map: ValorantMap) => {
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
            ? valorantMaps.find((map) => map.id === value.id)?.name || "Select a map"
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
                key={map.id}
                onSelect={() => handleSelectMap(map)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value && value.id === map.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {map.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover >
  )
}
