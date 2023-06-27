"use client"

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import PlayerForm from "./PlayerForm";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { X } from 'lucide-react';
import { cn } from "@/lib/utils"

const formSchema = z.object({
  players: z.array(
    z.object({
      agent: z.string().nullable(),
      played_by: z.string().uuid().nullable(),
      username: z.number().nullable(),
    })
  ),
});

export type FormValues = z.infer<typeof formSchema>;

export default function AddGames() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      players: [{
        agent: null,
        played_by: null,
        username: null
      }]
    },
  });

  // const [playerForms, setPlayerForms] = useState<FormValues['players']>([]);

  const handleAddPlayer = () => {
    // setPlayerForms((prevPlayerForms) => [
    //   ...prevPlayerForms,
    //   { agent: null, played_by: null, username: null },
    // ]);
    form.setValue('players', [
      ...form.getValues().players,
      { agent: null, played_by: null, username: null },
    ]);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log('form submited: ', values)
  }
  const handleAddGames = () => {
    form.handleSubmit(onSubmit)();
  };

  const handleRemovePlayer = (player: number) => {
    form.setValue(
      "players",
      form.getValues().players.filter((_, index) => index !== player)
    );
  };


  useEffect(() => {
    console.log('Form Values:', form.getValues());
  }, [form]);

  const watch = useWatch({ control: form.control, defaultValue: form.getValues() });

  return (
    <FormProvider {...form} >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {watch.players?.map((_form, index: number) => (
            <div className="flex align-middle" key={index}>
              <PlayerForm key={index} index={index} />
              {watch.players?.length && watch.players.length >= 2 && (
                <Button type="button" className={cn('h-auto rounded-none')} variant="destructive" onClick={() => handleRemovePlayer(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </form>

        <Button type="button" onClick={handleAddPlayer}>Add Player</Button>

        <Button onClick={handleAddGames}>
          Add games
        </Button>
      </Form>
    </FormProvider>
  );
}

