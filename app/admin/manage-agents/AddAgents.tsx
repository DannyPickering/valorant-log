"use client"

import { ValorantAgent } from '@/types/collections'

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
import Typography from '@/components/Typography'

type NewValorantAgent = Omit<ValorantAgent, 'created_at' | 'id'>;

const formSchema = z.object({
  name: z
    .string()
    .default('')
    .refine((value) => value.length >= 1, {
      message: 'Agent name must have a minimum length of 1 character.',
    }),
});

const AddAgents = () => {
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
    }
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await addAgent(data)
  };

  async function addAgent(agentData: NewValorantAgent) {
    try {
      setLoading(true);

      myToastRef.current = toast({
        title: `Attempting to add Agent`,
        description: (
          <p>
            {agentData.name}
          </p>
        ),
        action: <SquareLoader />
      })


      let { error } = await supabase.from('valorant_agents').insert({
        name: agentData.name,
      })
      if (error) throw error

      if (myToastRef.current) {
        myToastRef.current.update(
          {
            id: myToastRef.current.id,
            title: `Successfully added new Agent!`,
            description: (
              <p>
                {agentData.name}
              </p>
            ),
            action: <SuccessMark />
          })
      } else {
        toast(
          {
            title: `Successfully added new Agent!`,
            description: (
              <p>
                {agentData.name}
              </p>
            ),
            action: <SuccessMark />
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
      <Typography as="h2" element="h2">Add agents</Typography>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {!loading ? (
              <Plus className="mr-2 h-4 w-4" />
            ) : (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add Agent
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default AddAgents