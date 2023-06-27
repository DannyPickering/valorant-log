"use client"

import React, { useState, useEffect } from 'react'
import { useFormContext, UseFormRegister } from "react-hook-form"
import { FormValues } from './page'
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

import { AgentsComboBox } from '@/components/AgentsComboBox'
import { MapsComboBox } from "@/components/MapsComboBox"
import ProfilesComboBox from "@/components/ProfilesComboBox"
import AccountsComboBox from "@/components/AccountsComboBox"
import Typography from "@/components/Typography"
import { ValorantAccount, ValorantAgent } from '@/types/collections'


const PlayerForm = ({ index }: { index: number }) => {
  const { control, setValue, getValues } = useFormContext();
  const [showAccounts, setShowAccounts] = React.useState<boolean>(false);
  const [agent, setAgent] = useState<number>();
  const [playedBy, setPlayedBy] = useState('');
  const [username, setUsername] = useState<number>();

  useEffect(() => {
    if (playedBy !== undefined && playedBy !== '') {
      console.log(playedBy);

      setShowAccounts(true);
    }
  }, [playedBy]);

  const handlePlayedByChange = (value: { id: string }) => {
    setPlayedBy(value.id);

  };

  const handleAccountChange = (value: ValorantAccount) => {
    console.log(value);
    setUsername(value.id);
  };

  const handleAgentChange = (value: ValorantAgent) => {
    setAgent(value.id);
  };


  // Pass the field values to the parent component when needed
  // e.g., when the "Add Games" button is clicked
  const handleAddGames = () => {
    const playerData = {
      agent,
      played_by: playedBy,
      username,
    };

    // Pass the playerData to the parent component for further processing
    // e.g., add it to the array of players
    // You can pass it as an argument to a function prop received from the parent component
    // or use any other suitable method for passing data to the parent component
    // Example: onAddGames(playerData);
  };

  return (
    <div className="flex">
      {/* Played By Field */}
      <FormField
        control={control}
        name={`player[${index}].played_by` as 'player'}
        render={({ field }) => (
          <FormItem className="grid grid-rows-[auto,max-content]">
            <FormLabel className="self-center">Played by:</FormLabel>
            <ProfilesComboBox onSelectProfile={handlePlayedByChange} />
            <FormMessage />
          </FormItem>
        )}
      />

      {showAccounts ? (
        <FormField
          control={control}
          name="username"
          render={({ field }) => (
            <FormItem className="grid grid-rows-[auto,max-content]">
              <FormLabel className="self-center">Valorant account:</FormLabel>
              <AccountsComboBox userId={playedBy} onSelectAccount={handleAccountChange} />
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <div>{getValues().played_by}</div>
      )}

      {/* Agent Field */}
      <FormField
        control={control}
        name={`player[${index}].agent` as 'player'}
        render={({ field }) => (
          <FormItem className="grid grid-rows-[auto,max-content]">
            <FormLabel className="self-center">Agent</FormLabel>
            <AgentsComboBox onSelectAgent={handleAgentChange} />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PlayerForm
