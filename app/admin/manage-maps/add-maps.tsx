"use client"

import { ValorantMap } from '@/types/collections'

import React, { useState } from 'react'

import { createClient } from '@/lib/supabase-client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import type { ToasterToast } from "@/components/ui/use-toast"
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

import SquareLoader from '@/components/SquareLoader'
import SuccessMark from '@/components/SuccessMark'
import { Plus, Loader2 } from 'lucide-react'

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
  const myToastRef = React.useRef<{
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  } | null>(null);



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

      myToastRef.current = toast({
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
        action: <SquareLoader />
      })

      console.log(mapData);

      let { error } = await supabase.from('valorant_maps').insert({
        name: mapData.name,
        is_active: mapData.is_active,
      })
      if (error) throw error

      if (myToastRef.current) {
        myToastRef.current.update(
          {
            id: myToastRef.current.id,
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
            action: <SuccessMark />
          })
      } else {
        toast(
          {
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
            action: <p></p>
          })
      }

    } catch (error: any) {
      if (myToastRef.current) {
        myToastRef.current.update({
          id: myToastRef.current.id,
          title: 'Error:',
          variant: 'destructive',
          description: (
            <p>{error.message}</p>
          ),
          action: <></>
        });
      } else {
        toast({
          title: 'Error:',
          variant: 'destructive',
          description: (
            <p>{error.message}</p>
          ),
          action: <></>
        });
      }
    } finally {
      setLoading(false);
      form.reset();
    }
  }

  return (
    <div>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mb-6">Add Maps</h2>

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
          <Button type="submit" disabled={loading}>
            {!loading ? (
              <Plus className="mr-2 h-4 w-4" />
            ) : (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add map
          </Button>
        </form>
      </Form>
    </div>
  )
}
