import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { serverEncrypt } from "@/utils/encryption";

// Validation schema for capsule creation
const capsuleSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).nullable().optional(),
  language: z.string().nullable().optional(),
  codeContent: z.string(),
  note: z.string().max(2000).nullable().optional(),
  accessMode: z.enum(["PRIVATE", "SHARED", "PUBLIC"]).default("PRIVATE"),
  passHint: z.string().max(100).nullable().optional(),
  unlockDate: z.string().refine(
    (date) => {
      const unlockDate = new Date(date);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return unlockDate >= tomorrow;
    },
    { message: "Unlock date must be at least tomorrow" }
  ),
  sharedEmails: z.array(z.string().email()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate input data
    const validationResult = capsuleSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        }, 
        { status: 400 }
      );
    }
    
    const { 
      title, 
      description, 
      language, 
      codeContent, 
      note, 
      accessMode, 
      passHint, 
      unlockDate,
      sharedEmails = []
    } = validationResult.data;
    
    // Double-encrypt the code content for storage
    // Client-side encryption + server-side encryption
    const encryptedContent = serverEncrypt(codeContent);
    
    // Create the capsule in the database
    const capsule = await prisma.capsule.create({
      data: {
        title,
        description,
        language,
        codeContent: encryptedContent,
        note,
        accessMode,
        passHint,
        unlockDate: new Date(unlockDate),
        userId: session.user.id,
      },
    });
    
    // If capsule is shared with specific people, create sharing records
    if (accessMode === "SHARED" && sharedEmails.length > 0) {
      await prisma.capsuleShare.createMany({
        data: sharedEmails.map((email) => ({
          capsuleId: capsule.id,
          email,
        })),
        skipDuplicates: true,
      });
    }
    
    // Return successful response with capsule ID
    return NextResponse.json(
      { 
        message: "Capsule created successfully", 
        capsuleId: capsule.id 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating capsule:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 