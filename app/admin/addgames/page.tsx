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
import { Input } from "@/components/ui/input"

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
    })
})

export default function Addgames() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      episode: 6,
      act: 3
    }
  })

  const { register } = form

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Send to database 
    console.log(values);

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <Button type="submit">Add game</Button>
      </form>
    </Form>
  )
}
