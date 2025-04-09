import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AccessMode, Prisma } from "@prisma/client";

// Set export const dynamic to indicate this is a dynamic route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const sort = searchParams.get('sort') === 'popular' ? 'popular' : 'recent';
    const page = Number(searchParams.get('page') || '1');
    const pageSize = 12;
    const skip = (page - 1) * pageSize;
    
    // Build the filter conditions
    const where = {
      accessMode: AccessMode.PUBLIC,
      isUnlocked: true,
      isDeleted: false,
      ...(language ? { language } : {}),
    };
    
    // Build the order by condition
    const orderBy = sort === 'popular'
      ? [
          { 
            comments: { 
              _count: Prisma.SortOrder.desc
            } 
          },
          { unlockDate: Prisma.SortOrder.desc }
        ]
      : [{ unlockDate: Prisma.SortOrder.desc }, { createdAt: Prisma.SortOrder.desc }];
    
    // Fetch the public capsules
    const capsules = await prisma.capsule.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        description: true,
        language: true,
        unlockDate: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    
    // Get the total count for pagination
    const totalCount = await prisma.capsule.count({ where });
    
    return NextResponse.json({
      capsules,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / pageSize),
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching public capsules:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 