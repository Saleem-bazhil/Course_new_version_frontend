"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";


function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col w-full", className)}
      {...props}
    />
  );
}


function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex items-center gap-10 border-b border-white/10 bg-transparent p-0",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative px-0 pb-3 text-sm font-medium transition-colors",
        "text-white/50 hover:text-white",
        "focus-visible:outline-none",
        "data-[state=active]:text-purple-500",
        "data-[state=active]:after:absolute",
        "data-[state=active]:after:left-0",
        "data-[state=active]:after:-bottom-[1px]",
        "data-[state=active]:after:h-[2px]",
        "data-[state=active]:after:w-full",
        "data-[state=active]:after:bg-purple-500",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
