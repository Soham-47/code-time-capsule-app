import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// Define type for the capsule data returned to the client
type CapsuleData = {
  id: string;
  title: string;
  description: string | null;
  language: string | null;
  accessMode: "PRIVATE" | "SHARED" | "PUBLIC";
  unlockDate: Date;
  isUnlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get user capsules that are not deleted
    const capsules = await prisma.capsule.findMany({
      where: {
        userId: session.user.id,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        language: true,
        accessMode: true,
        unlockDate: true,
        isUnlocked: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    // Check if any capsules should be unlocked based on current date
    const now = new Date();
    const capsulesToUnlock = capsules.filter(
      (capsule: CapsuleData) => !capsule.isUnlocked && new Date(capsule.unlockDate) <= now
    );
    
    // Unlock any capsules that have reached their unlock date
    if (capsulesToUnlock.length > 0) {
      await Promise.all(
        capsulesToUnlock.map((capsule: CapsuleData) =>
          prisma.capsule.update({
            where: { id: capsule.id },
            data: { isUnlocked: true },
          })
        )
      );
      
      // Update the local capsules data with unlocked status
      capsulesToUnlock.forEach((capsule: CapsuleData) => {
        const index = capsules.findIndex((c: CapsuleData) => c.id === capsule.id);
        if (index !== -1) {
          capsules[index].isUnlocked = true;
        }
      });
    }
    
    return NextResponse.json(capsules);
  } catch (error) {
    console.error("Error fetching capsules:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 