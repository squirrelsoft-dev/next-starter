"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UpdateProfileFormProps {
  currentName: string;
}

/**
 * Update Profile Form
 *
 * Client component that calls server actions with Layer 3 authentication.
 * Demonstrates how UI components interact with protected server actions.
 */
export function UpdateProfileForm({ currentName }: UpdateProfileFormProps) {
  const [name, setName] = useState(currentName);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setMessage(null);

    startTransition(async () => {
      // LAYER 3 DEFENSE: Server action validates authentication
      const result = await updateProfile(formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
        setName(result.data.name);
      } else {
        setMessage({
          type: "error",
          text: result.error,
        });
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          required
        />
      </div>

      {message && (
        <div
          className={`rounded-md p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}
