"use client"

import React, { useState, useEffect } from 'react'
import { useFormContext } from "react-hook-form"
import { FormValues } from './page'

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"


import { AgentsComboBox } from '@/components/AgentsComboBox'
import ProfilesComboBox from "@/components/ProfilesComboBox"
import AccountsComboBox from "@/components/AccountsComboBox"
import { ValorantAccount, ValorantAgent } from '@/types/collections'


const PlayerForm = ({ index }: { index: number }) => {
  const { control, setValue, getValues } = useFormContext<FormValues>();
  const [showAccounts, setShowAccounts] = React.useState<boolean>(false);
  const [playedBy, setPlayedBy] = useState('');

  useEffect(() => {
    if (playedBy !== undefined && playedBy !== '') {
      setShowAccounts(true);
    }
  }, [playedBy]);

  const handlePlayedByChange = (value: { id: string }) => {
    setPlayedBy(value.id)
    setValue(`players.${index}.played_by`, value.id);
    console.log('Form Values:', getValues()); // Log form values here
  };

  const handleAccountChange = (value: ValorantAccount) => {
    setValue(`players.${index}.username`, value.id)
  };

  const handleAgentChange = (value: ValorantAgent) => {
    setValue(`players.${index}.agent`, value.id.toString());
  };

  return (
    <div className="flex">
      <FormField
        control={control}
        name={`players.${index}.played_by`}
        render={({ field }) => (
          <FormItem className="grid grid-rows-[auto,max-content]">
            <FormLabel className="self-center">Played by:</FormLabel>
            <ProfilesComboBox onSelectProfile={handlePlayedByChange} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`players.${index}.username`}
        render={({ field }) => (
          <FormItem className="grid grid-rows-[auto,max-content]">
            <FormLabel className="self-center">Valorant account:</FormLabel>
            <AccountsComboBox userId={playedBy} onSelectAccount={handleAccountChange} disabled={!showAccounts} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`players.${index}.agent`}
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
