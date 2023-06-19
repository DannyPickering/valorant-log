import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

export default function MapsSkeleton() {
  return (
    <>
      <Skeleton className="w-[200px] h-[28px] bg-gray-400 mb-4" />
      <Skeleton className="w-[150px] h-[20px] bg-gray-400 mb-4" />
      {
        Array.from({ length: 8 }, (_, i) => i++).map((item) => (
          <Card key={item} className="mb-8">
            <CardHeader>
              <Skeleton className="w-32 h-4 bg-gray-400" />
            </CardHeader>
            <CardContent className="flex justify-between">
              <Skeleton className="w-64 h-3 bg-gray-400" />
              <Skeleton className="w-11 h-6 bg-gray-400 rounded-3xl" />
            </CardContent>
            <CardFooter>
              <Skeleton className="w-32 h-10 bg-gray-400" />
            </CardFooter>
          </Card>
        ))
      }
    </>

  );
}
