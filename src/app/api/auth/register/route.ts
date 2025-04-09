import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Define validation schema for registration data
const registrationSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
  email: z
    .string()
    .email('Invalid email address'),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validationResult = registrationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validationResult.error.errors 
        }, 
        { status: 400 }
      );
    }
    
    const { username, email, password } = validationResult.data;
    
    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });
    
    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json(
          { message: 'Username already taken' },
          { status: 409 }
        );
      }
      
      if (existingUser.email === email) {
        return NextResponse.json(
          { message: 'Email already registered' },
          { status: 409 }
        );
      }
    }
    
    // Hash password
    const hashedPassword = await hash(password, 12);
    
    // Create new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    
    // Return success response (excluding password)
    return NextResponse.json(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 