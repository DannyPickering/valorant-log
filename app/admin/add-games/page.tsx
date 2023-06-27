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
import GameConstantsForm from "./GameConstantsForm";
import Typography from "@/components/Typography";

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
  players: z.array(
    z.object({
      played_by: z.string().uuid().nullable().refine((value) => value !== null, {
        message: "Played by is required",
      }),
      valorant_account_id: z.number().nullable().refine((value) => value !== null, {
        message: "Valorant account is required",
      }),
      valorant_agent_id: z.number().nullable().refine((value) => value !== null, {
        message: "Agent is required",
      }),
      combat_score: z.coerce.number().nullable().refine((value) => value !== null, {
        message: "Combat score is required",
      }),
      first_blood_count: z.coerce.number().nullable().refine((value) => value !== null, {
        message: "First blood count is required",
      }),
    })
  ),
});

export type FormValues = z.infer<typeof formSchema>;

export default function AddGames() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      episode: 1,
      act: 1,
      queue: 'comp',
      won_game: false,
      players: [{
        played_by: null,
        valorant_account_id: null,
        valorant_agent_id: null,
        combat_score: null,
        first_blood_count: null
      }]
    },
  });

  const handleAddPlayer = () => {
    form.setValue('players', [
      ...form.getValues().players,
      {
        played_by: null,
        valorant_agent_id: null,
        valorant_account_id: null,
        combat_score: null,
        first_blood_count: null
      },
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
          <GameConstantsForm />

          <Typography element="h2" as="h2">Players</Typography>
          {watch.players?.map((_form, index: number) => (
            <div className="flex my-10" key={index}>
              <PlayerForm key={index} index={index} />
              {watch.players?.length && watch.players.length >= 2 && (
                <Button type="button" className={cn('h-auto rounded-none')} variant="destructive" onClick={() => handleRemovePlayer(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </form>

        <Button className="mt-4 mb-8" type="button" onClick={handleAddPlayer}>Add Player</Button>

        <Button onClick={handleAddGames}>
          Add games
        </Button>
      </Form>
    </FormProvider>
  );
}