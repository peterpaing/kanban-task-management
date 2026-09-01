"use client";

import EmptyBoardState from "@/app/components/EmptyBoardState";

export default function HomePage() {
  return (
    <EmptyBoardState
      onAddColumn={() => {
        console.log("Open the Add New Column form later");
      }}
    />
  );
}