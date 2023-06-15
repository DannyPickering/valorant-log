"use client"

import { ValorantMap } from '@/types/collections'
import { Database } from '@/types/supabase'

import React, { useState } from 'react'

import { createClient } from '@/lib/supabase-client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

type NewValorantMap = Omit<ValorantMap, 'created_at' | 'id'>;

const formSchema = z.object({
  name: z
    .string()
    .default('')
    .refine((value) => value.length >= 1, {
      message: 'Map name must have a minimum length of 1 character.',
    }),
  is_active: z
    .boolean()
});

export default function addMaps() {
  const supabase = createClient();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      is_active: true
    }
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await addMap(data)
  };

  async function addMap(mapData: NewValorantMap) {
    try {
      setLoading(true);

      toast({
        title: `Attempting to add Map: ${mapData.name}`,
        description: (
          <>
            {mapData.is_active ? (
              <p>With map set to active.</p>
            ) : (
              <p>With map set to inactive.</p>
            )}
          </>
        ),
      })

      console.log(mapData);

      let { error } = await supabase.from('valorant_maps').insert({
        name: mapData.name,
        is_active: mapData.is_active,
      })
      if (error) throw error

      toast({
        title: `Added Map: ${mapData.name}`,
        description: (
          <>
            {mapData.is_active ? (
              <p>Map was set to active.</p>
            ) : (
              <p>Map was set to inactive.</p>
            )}
          </>
        ),
      })

    } catch (error: any) {
      toast({
        title: 'Error:',
        variant: 'destructive',
        description: (
          <p>{error.message}</p>
        ),
      });
    } finally {
      setLoading(false);

    }
  }

  return (
    <div>
      <h2>Add Maps</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Map Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    In active rotation
                  </FormLabel>
                  <FormDescription>
                    If the map is in the current rotation. You can edit this above once added.
                  </FormDescription>
                </div>
                <FormControl className="ml-4">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>Add map</Button>
        </form>
      </Form>
    </div>
  )
}
