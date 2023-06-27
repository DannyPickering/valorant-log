"use client"

import React, { useEffect } from 'react'
import { useFormContext } from "react-hook-form"
import { FormValues } from './page'


import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

import { MapsComboBox } from "@/components/MapsComboBox"
import Typography from "@/components/Typography"

import { getCurrentSeason } from "@/lib/supabase-queries"

export default function GameConstantsForm() {
  const { control, setValue, getValues } = useFormContext<FormValues>();
  useEffect(() => {
    const fetchData = async () => {

      try {
        const season = await getCurrentSeason();

        if (season !== null) {
          setValue('episode', season.episode ?? 1)
          setValue('act', season.act ?? 1)
        }

      } catch (error) {
        console.error('Error fetching season: ', error);
      }
    };
    fetchData();

  }, []);

  const handleSelectChange = (fieldName: keyof FormValues, value: any) => {
    setValue(fieldName, value)
  }

  return (
    <div className="py-8">
      <Typography element="h2" as="h2">Constants for each game</Typography>
      <p>These values will be used for all accounts you add.</p>
      <div className="flex mt-4">
        <FormField
          control={control}
          name="episode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Episode</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="act"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Act</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="queue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Queue</FormLabel>
              <FormControl>
                <Select defaultValue={getValues().queue} value={getValues().queue} onValueChange={(value) => handleSelectChange('queue', value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Queue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comp">Comp</SelectItem>
                    <SelectItem value="unrated">Unrated</SelectItem>
                  </SelectContent>
                </Select>

              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="won_game"
          render={({ field }) => (
            <FormItem className="flex flex-col p-1">
              <FormLabel className="">
                Won game
              </FormLabel>
              <FormControl className="">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="map"
          render={({ field }) => (
            <FormItem className="grid grid-rows-[auto,max-content]">
              <FormLabel className="self-center">Map</FormLabel>
              <FormControl>
                <MapsComboBox onSelectMap={(value) => setValue('map', value.id)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      </div>
    </div>
  )
}
