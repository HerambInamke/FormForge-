import { z } from 'zod';

export const page1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  addressLine1: z.string().min(5, 'Address must be at least 5 characters').max(100, 'Address must be less than 100 characters'),
  addressLine2: z.string().max(100, 'Address must be less than 100 characters').optional(),
  city: z.string().min(2, 'City must be at least 2 characters').max(50, 'City must be less than 50 characters'),
  state: z.string().min(2, 'State must be at least 2 characters').max(50, 'State must be less than 50 characters'),
  zipcode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
});

// Create two different schemas based on the study status
const studyingSchema = z.object({
  isStudying: z.literal('true'),
  studyLocation: z.string()
    .min(2, 'Study location must be at least 2 characters')
    .max(100, 'Study location must be less than 100 characters')
});

const notStudyingSchema = z.object({
  isStudying: z.literal('false'),
  studyLocation: z.string().optional()
});

// Use .union() to combine the two schemas
export const page2Schema = z.discriminatedUnion('isStudying', [
  studyingSchema,
  notStudyingSchema
]);

export const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  githubLink: z.string().url('Invalid GitHub URL').optional().or(z.literal(''))
});

export const page3Schema = z.object({
  projects: z.array(projectSchema).min(1, 'At least one project is required').max(5, 'Maximum 5 projects allowed')
});

export const completeFormSchema = z.object({
  page1: page1Schema,
  page2: page2Schema,
  page3: page3Schema
}); 