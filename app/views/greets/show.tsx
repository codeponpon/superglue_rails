import React from "react";
import { useContent } from "@thoughtbot/superglue";

export default function GreetsShow() {
  const { body, footer } = useContent<{
    body: { greet: string };
    footer: string;
  }>();

  const { greet } = body;

  return (
    <>
      <h1>{greet}</h1>
      <span>{footer}</span>
    </>
  );
}
