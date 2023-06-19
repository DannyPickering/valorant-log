"use client"

import React, { useState, useEffect } from 'react'
import { ValorantAgent } from '@/types/collections';
import { getAllAgents } from '@/lib/supabase-queries';
import { createClient } from '@/lib/supabase-client';

import { Trash2 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import Typography from '@/components/Typography';
import AgentsSkeleton from './AgentsSkeleton';

export default function ValorantAgents() {
  const supabase = createClient();
  const [loading, setLoading] = useState<boolean>(true);
  const [valorantAgents, setValorantAgents] = useState<ValorantAgent[]>([]);
  const [delAgentDialogOpen, setDelAgentDialogOpen] = useState<boolean>(false);
  const [agentToDelete, setAgentToDelete] = useState<ValorantAgent | null>(null);

  useEffect(() => {
    const fetchData = async () => {

      try {
        setLoading(true);
        const agents = await getAllAgents();
        if (agents !== null) {
          setValorantAgents(agents);
        }
        setLoading(false)

      } catch (error) {
        console.error('Error fetching agents: ', error);
      }
    };
    fetchData();

    const realtime = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'valorant_agents' },
        (payload: any) => {
          if (payload.eventType === 'DELETE') {
            setValorantAgents((prevAgents) => {
              return prevAgents.filter((agent) => agent.id !== payload.old.id)
            })
          } else if (payload.eventType === 'INSERT') {
            setValorantAgents((prevAgents) => [...prevAgents, payload.new])
          }
        }
      )
      .subscribe()

    // Clean up the subscription when the component unmounts
    return () => {
      realtime.unsubscribe();
    };

  }, []);

  const handleOpenDelDialog = (agent: ValorantAgent) => {
    setAgentToDelete(agent);
    setDelAgentDialogOpen(true);
  };

  const handleCloseDelDialog = () => {
    setAgentToDelete(null);
    setDelAgentDialogOpen(false);
  };

  async function handleConfirmDel() {
    if (agentToDelete) {
      try {
        const { data, error } = await supabase
          .from('valorant_agents')
          .delete()
          .match({ id: agentToDelete.id })

        if (error) {
          throw new Error(error.message);
        }

        return data;
      } catch (error) {
        throw new Error((error as Error).message);
      } finally {
        handleCloseDelDialog();
      }
    }
  };

  return (
    <div className="mb-8">
      {loading ? (
        <AgentsSkeleton />
      ) : valorantAgents.length > 0 ? (
        <>
          <Typography element="h2" as="h2">Agents</Typography>
          <Typography element="h3" as="h6">{valorantAgents.length} total agents</Typography>
          {valorantAgents
            .sort((a, b) => {
              const nameA = a.name ?? '';
              const nameB = b.name ?? '';
              return nameA.localeCompare(nameB);
            })
            .map((agent: ValorantAgent) => (
              <Card key={agent.id} className="mb-8">
                <CardHeader>
                  <CardTitle>{agent.name}</CardTitle>
                </CardHeader>

                <CardFooter>
                  <Dialog open={delAgentDialogOpen} onOpenChange={setDelAgentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" onClick={() => handleOpenDelDialog(agent)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Agent
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Delete {agent.name}</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to permamently remove {agent.name}? Doing so may remove games played on this agent. Only delete agents you just created with typos.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="ghost" onClick={handleCloseDelDialog}>Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirmDel}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
        </>
      ) : (
        <div>
          <p>No agents were found. You can add some below.</p>
        </div>
      )}
    </div>
  )
}
