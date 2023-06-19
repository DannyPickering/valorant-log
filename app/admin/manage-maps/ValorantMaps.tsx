"use client"

import React, { useState, useEffect } from 'react'
import { ValorantMap } from '@/types/collections';
import { getAllMaps, updateMapById } from '@/lib/supabase-queries';
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


import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import MapsSkeleton from './MapsSkeleton';

export default function ValorantMaps() {
  const supabase = createClient();
  const [loading, setLoading] = useState<boolean>(true);
  const [valorantMaps, setValorantMaps] = useState<ValorantMap[]>([]);
  const [deleteMapDialogOpen, setDeleteMapDialogOpen] = useState<boolean>(false);
  const [mapToDelete, setMapToDelete] = useState<ValorantMap | null>(null);

  useEffect(() => {
    const fetchData = async () => {

      try {
        setLoading(true);
        const maps = await getAllMaps();
        if (maps !== null) {
          setValorantMaps(maps);
        }
        setLoading(false)

      } catch (error) {
        console.error('Error fetching maps: ', error);
      }
    };
    fetchData();

    const realtime = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'valorant_maps' },
        (payload: any) => {
          if (payload.eventType === 'UPDATE') {
            updateMapInUI(payload.new);
          } else if (payload.eventType === 'DELETE') {
            removeMapFromUI(payload.old)
          } else if (payload.eventType === 'INSERT') {
            setValorantMaps((prevMaps) => [...prevMaps, payload.new])
          }
        }
      )
      .subscribe()

    // Clean up the subscription when the component unmounts
    return () => {
      realtime.unsubscribe();
    };

  }, []);

  async function updateMapStatus(checkedState: boolean, mapId: number) {
    try {
      await updateMapById(mapId, checkedState)
    } catch (error) {
      console.log(error);
    }
  }

  function updateMapInUI(updatedMap: ValorantMap) {
    setValorantMaps((prevMaps) => {
      return prevMaps.map((map) => {
        if (map.id === updatedMap.id) {
          // Update the specific map with the updated data
          return {
            ...map,
            is_active: updatedMap.is_active,
          };
        }
        return map;
      });
    });
  }

  function removeMapFromUI(deletedMap: ValorantMap) {
    setValorantMaps((prevMaps) => {
      return prevMaps.filter((map) => map.id !== deletedMap.id);
    });
  }

  const handleOpenDeleteMapDialog = (map: ValorantMap) => {
    setMapToDelete(map);
    setDeleteMapDialogOpen(true);
  };

  const handleCloseDeleteMapDialog = () => {
    setMapToDelete(null);
    setDeleteMapDialogOpen(false);
  };

  async function handleConfirmDeleteMap() {
    if (mapToDelete) {
      try {
        const { data, error } = await supabase
          .from('valorant_maps')
          .delete()
          .match({ id: mapToDelete.id })

        if (error) {
          throw new Error(error.message);
        }

        return data;
      } catch (error) {
        throw new Error((error as Error).message);
      } finally {
        handleCloseDeleteMapDialog();
      }
    }
  };

  return (
    <div className="mb-8">
      {loading ? (
        <MapsSkeleton />
      ) : valorantMaps.length > 0 ? (
        valorantMaps
          .sort((a, b) => {
            const nameA = a.name ?? '';
            const nameB = b.name ?? '';
            return nameA.localeCompare(nameB);
          })
          .map((map: ValorantMap) => (
            <Card key={map.id} className="mb-8">
              <CardHeader>
                <CardTitle>{map.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between">
                <p>Map is in active rotation:</p>
                <Switch
                  checked={map.is_active ?? false}
                  onCheckedChange={(checkedState) => updateMapStatus(checkedState, map.id)}
                />
              </CardContent>
              <CardFooter>
                <Dialog open={deleteMapDialogOpen} onOpenChange={setDeleteMapDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" onClick={() => handleOpenDeleteMapDialog(map)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Map
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete {map.name}</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to permamently remove {map.name}? Doing so may remove games played on this map. Only delete maps you just created with typos.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="ghost" onClick={handleCloseDeleteMapDialog}>Cancel</Button>
                      <Button variant="destructive" onClick={handleConfirmDeleteMap}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))
      ) : (
        <div>
          <p>No maps were found. You can add some below.</p>
        </div>
      )}
    </div>
  )
}
