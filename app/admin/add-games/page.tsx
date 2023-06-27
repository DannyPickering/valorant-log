"use client"

import React, { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
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

const formSchema = z.object({
  player: z.array(
    z.object({
      agent: z.string(),
      played_by: z.string().uuid(),
      username: z.number().nullable(),
    })
  ),
});


export type FormValues = z.infer<typeof formSchema>;

export default function AddGames() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { player: [] },
  });

  const [playerForms, setPlayerForms] = useState<FormValues['player']>([]);

  const handleAddPlayer = () => {
    setPlayerForms((prevPlayerForms) => [
      ...prevPlayerForms,
      { agent: "", played_by: "", username: null },
    ]);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log('form submited: ', values)
  }

  const handleAddGames = () => {
    form.handleSubmit(onSubmit)();
    console.log(formSchema);
  };


  return (
    <FormProvider {...form} >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {playerForms.map((_form, index: number) => (
            <PlayerForm key={index} index={index} />
          ))}

          <Button onClick={handleAddPlayer}>Add Player</Button>
          <Button onClick={handleAddGames}>
            Add games
          </Button>
        </form>

      </Form>
    </FormProvider>
  );
}

