"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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

const formSchema = z.object({
  episode: z
    .coerce.number()
    .refine((value) => String(value).length >= 1, {
      message: 'Episode must be at least one digit.',
      path: ['episode']
    })
    .refine((value) => value >= 1, {
      message: 'Episode must be great than 0.',
      path: ['episode']
    }),
  act: z
    .coerce.number()
    .refine((value) => String(value).length >= 1, {
      message: 'Act must be at least one digit.',
      path: ['act']
    })
    .refine((value) => value >= 1, {
      message: 'Act must be great than 0.',
      path: ['act']
    }),
  queue: z
    .enum(['comp', 'unrated']),
  won_game: z
    .boolean(),
  map: z
    .number(),
})

export default function GameConstantsForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      episode: 1,
      act: 1,
      queue: 'comp',
      won_game: false
    }
  })

  useEffect(() => {
    const fetchData = async () => {

      try {
        const season = await getCurrentSeason();

        if (season !== null) {
          form.setValue('episode', season.episode ?? 1)
          form.setValue('act', season.act ?? 1)
        }

      } catch (error) {
        console.error('Error fetching season: ', error);
      }
    };
    fetchData();

  }, []);



  const { register } = form

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Send to database 
    console.log(values);
  }

  type FormValues = z.infer<typeof formSchema>;
  const handleSelectChange = (fieldName: keyof FormValues, value: any) => {
    form.setValue(fieldName, value)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Typography element="h2" as="h2">Constants for each game</Typography>
        <p>These values will be used for all accounts you add.</p>
        <div className="flex">
          <FormField
            control={form.control}
            name="episode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Episode</FormLabel>
                <FormControl>
                  <Input {...register('episode')} {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
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
            control={form.control}
            name="queue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Queue</FormLabel>
                <FormControl>
                  <Select defaultValue={form.getValues().queue} value={form.getValues().queue} onValueChange={(value) => handleSelectChange('queue', value)}>
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
            control={form.control}
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
            control={form.control}
            name="map"
            render={({ field }) => (
              <FormItem className="grid grid-rows-[auto,max-content]">
                <FormLabel className="self-center">Map</FormLabel>
                <FormControl>
                  <MapsComboBox onSelectMap={(value) => form.setValue('map', value.id)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
      </form>
    </Form>
  )
}
