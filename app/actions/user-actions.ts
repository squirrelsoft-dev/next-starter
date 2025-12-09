"use server";

import { requireAuth, requireUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Server Actions with Authentication
 *
 * LAYER 3 DEFENSE: Server Action Authorization
 *
 * These actions are the FINAL line of defense for data mutations.
 * Even if proxy middleware and page guards fail, these actions validate authentication.
 *
 * Defense Layers:
 * 1. Proxy middleware - Blocks unauthenticated requests
 * 2. Page/component check - Prevents UI from calling action
 * 3. Action validation (this) - Final check before mutation
 */

/**
 * Action Result Types
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Update Profile Schema
 */
const updateProfileSchema = z.object({
  name: z.string().min(1, "Name must not be empty").max(100, "Name too long"),
});

/**
 * Update User Profile
 *
 * Updates the authenticated user's profile information.
 *
 * LAYER 3 DEFENSE: This action validates authentication before any mutation.
 *
 * @param formData - Form data containing profile updates
 * @returns Action result with updated profile or error
 *
 * @example
 * // In a Client Component
 * import { updateProfile } from "@/app/actions/user-actions";
 *
 * function ProfileForm() {
 *   async function handleSubmit(formData: FormData) {
 *     const result = await updateProfile(formData);
 *     if (result.success) {
 *       toast.success("Profile updated!");
 *     } else {
 *       toast.error(result.error);
 *     }
 *   }
 *
 *   return <form action={handleSubmit}>...</form>;
 * }
 */
export async function updateProfile(
  formData: FormData
): Promise<ActionResult<{ name: string; email: string }>> {
  try {
    // LAYER 3 DEFENSE: Require authentication
    const user = await requireUser();

    // Extract and validate input
    const name = formData.get("name");
    const validationResult = updateProfileSchema.safeParse({ name });

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Invalid input",
      };
    }

    // AUTHORIZATION: User can only update their own profile
    // We use user.id from the authenticated session
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name: validationResult.data.name },
      select: {
        name: true,
        email: true,
      },
    });

    // Revalidate pages that display user data
    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      data: {
        name: updatedUser.name || "",
        email: updatedUser.email || "",
      },
    };
  } catch (error) {
    console.error("Error updating profile:", error);

    // Handle authentication errors specifically
    if (error instanceof Error && error.name === "AuthenticationError") {
      return {
        success: false,
        error: "You must be signed in to update your profile",
      };
    }

    return {
      success: false,
      error: "Failed to update profile. Please try again.",
    };
  }
}

/**
 * Delete User Account
 *
 * Deletes the authenticated user's account and all associated data.
 * This is a destructive action that requires extra care.
 *
 * LAYER 3 DEFENSE: Validates authentication before deletion.
 *
 * @returns Action result indicating success or error
 *
 * @example
 * // In a Client Component with confirmation
 * import { deleteAccount } from "@/app/actions/user-actions";
 *
 * function DeleteAccountButton() {
 *   async function handleDelete() {
 *     if (!confirm("Are you sure? This cannot be undone.")) return;
 *
 *     const result = await deleteAccount();
 *     if (result.success) {
 *       // Redirect to home (user will be logged out)
 *       window.location.href = "/";
 *     } else {
 *       alert(result.error);
 *     }
 *   }
 *
 *   return <button onClick={handleDelete}>Delete Account</button>;
 * }
 */
export async function deleteAccount(): Promise<ActionResult<{ deleted: boolean }>> {
  try {
    // LAYER 3 DEFENSE: Require authentication
    const user = await requireUser();

    // AUTHORIZATION: User can only delete their own account
    // Delete in a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Delete associated records first (if any)
      // For example, if you have posts, comments, etc.

      // Delete the user account
      await tx.user.delete({
        where: { id: user.id },
      });
    });

    return {
      success: true,
      data: { deleted: true },
    };
  } catch (error) {
    console.error("Error deleting account:", error);

    if (error instanceof Error && error.name === "AuthenticationError") {
      return {
        success: false,
        error: "You must be signed in to delete your account",
      };
    }

    return {
      success: false,
      error: "Failed to delete account. Please try again.",
    };
  }
}

/**
 * Get User Stats (Read-only action for demonstration)
 *
 * Returns statistics about the authenticated user.
 * Demonstrates that even read operations in server actions should validate auth.
 *
 * LAYER 3 DEFENSE: Validates authentication before data access.
 *
 * @returns Action result with user stats or error
 */
export async function getUserStats(): Promise<
  ActionResult<{ accountAge: number; lastSignIn: Date | null }>
> {
  try {
    // LAYER 3 DEFENSE: Require authentication
    const session = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        createdAt: true,
        // If you track last sign-in, include it here
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const accountAgeInDays = Math.floor(
      (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      success: true,
      data: {
        accountAge: accountAgeInDays,
        lastSignIn: null, // Implement if you track this
      },
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);

    if (error instanceof Error && error.name === "AuthenticationError") {
      return {
        success: false,
        error: "You must be signed in to view stats",
      };
    }

    return {
      success: false,
      error: "Failed to fetch stats",
    };
  }
}
