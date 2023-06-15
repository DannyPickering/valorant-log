"use client"

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

import { AgentsComboBox } from '@/components/agentsComboBox'
import { MapsComboBox } from "@/components/mapsComboBox"
import ProfilesComboBox from "@/components/profilesComboBox"
import AccountsComboBox from "@/components/accountsComboBox"
import React from "react"

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
    .string(),
  map: z
    .string(),
  agent: z
    .string(),
  played_by: z
    .string().uuid(),
  username: z
    .string()
})

export default function Addgames() {
  const [showAccounts, setShowAccounts] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      episode: 6,
      act: 3,
      queue: 'comp',
      won_game: 'false'
    }
  })

  const { register } = form

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Send to database 

    const { won_game, ...restValues } = values;

    const parsedValues = {
      ...restValues,
      won_game: won_game === 'true' // convert string back to boolean
    }
    console.log(parsedValues);
  }

  type FormValues = z.infer<typeof formSchema>;
  const handleSelectChange = (fieldName: keyof FormValues, value: string) => {
    form.setValue(fieldName, value)
    if (fieldName === 'played_by') {
      setShowAccounts(true)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2>Constants for each game</h2>
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
              <FormItem>
                <FormLabel>Won/Lost</FormLabel>
                <FormControl>
                  <Select value={form.getValues().won_game} onValueChange={(value) => form.setValue('won_game', value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Won/Lost" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Won</SelectItem>
                      <SelectItem value="false">Lost</SelectItem>
                    </SelectContent>
                  </Select>

                </FormControl>
                <FormMessage />
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
                  <MapsComboBox onSelectMap={(value) => form.setValue('map', value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <div className="flex">
          <FormField
            control={form.control}
            name="played_by"
            render={({ field }) => (
              <FormItem className="grid grid-rows-[auto,max-content]">
                <FormLabel className="self-center">Played by:</FormLabel>
                <ProfilesComboBox onSelectProfile={(value) => handleSelectChange('played_by', value.id)} />
                <FormMessage />
              </FormItem>
            )}
          />
          {showAccounts ? (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="grid grid-rows-[auto,max-content]">
                  <FormLabel className="self-center">Valorant account:</FormLabel>
                  <AccountsComboBox userId={form.getValues().played_by} onSelectAccount={(value) => form.setValue('username', value)} />
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div>{form.getValues().played_by}</div>
          )}
          <FormField
            control={form.control}
            name="agent"
            render={({ field }) => (
              <FormItem className="grid grid-rows-[auto,max-content]">
                <FormLabel className="self-center">Agent</FormLabel>
                <AgentsComboBox onSelectAgent={(value) => form.setValue('agent', value)} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Add game</Button>
      </form>
    </Form>
  )
}
