import { requireApiAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * User Settings Schema
 * Validates incoming settings updates
 */
const updateSettingsSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
});

/**
 * GET /api/user/settings
 *
 * Returns the authenticated user's settings.
 *
 * LAYER 2 DEFENSE: API Route Authentication
 *
 * @returns 200 with user settings, or 401 if unauthorized
 */
export async function GET() {
  // LAYER 2 DEFENSE: Validate authentication
  const authResult = await requireApiAuth();

  if ("error" in authResult) {
    return authResult.response;
  }

  const { user } = authResult;

  try {
    const userSettings = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!userSettings) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      settings: userSettings,
    });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/settings
 *
 * Updates the authenticated user's settings.
 *
 * LAYER 2 DEFENSE: API Route Authentication
 *
 * Defense Layers:
 * 1. Proxy middleware - Blocks unauthenticated API requests
 * 2. API route guard (this) - Returns 401 if somehow bypassed
 * 3. Authorization check - Ensures users can only update their own data
 * 4. Input validation - Validates and sanitizes input data
 *
 * @param request - Request with JSON body containing settings to update
 * @returns 200 with updated settings, 400 for invalid input, or 401 if unauthorized
 */
export async function PUT(request: Request) {
  // LAYER 2 DEFENSE: Validate authentication
  const authResult = await requireApiAuth();

  if ("error" in authResult) {
    return authResult.response;
  }

  const { user } = authResult;

  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateSettingsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email } = validationResult.data;

    // AUTHORIZATION CHECK: User can only update their own settings
    // The user.id from the session ensures users can't modify others' data
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({
      settings: updatedUser,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating user settings:", error);

    // Handle unique constraint violations (e.g., email already exists)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
