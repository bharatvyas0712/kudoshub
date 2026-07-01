import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().trim().email('Enter a valid email'),
	password: z.string().min(8, 'Password must be at least 8 characters')
});

export const registerSchema = z.object({
	name: z.string().trim().min(2, 'Name must be at least 2 characters'),
	email: z.string().trim().email('Enter a valid email'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	department: z.string().trim().min(2, 'Department is required')
});

export const kudosSchema = z.object({
	receiverId: z.string().min(1, 'Select an employee'),
	message: z.string().trim().min(1, 'Message is required').max(500, 'Message cannot exceed 500 characters')
});
