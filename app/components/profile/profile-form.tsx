"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

// Define the form schema with validation
const profileFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters.' })
        .max(50, { message: 'Name must not be longer than 50 characters.' }),
    email: z
        .string()
        .email({ message: 'Please enter a valid email address.' }),
    bio: z
        .string()
        .max(500, { message: 'Bio must not be longer than 500 characters.' })
        .optional(),
    company: z
        .string()
        .max(100, { message: 'Company name must not be longer than 100 characters.' })
        .optional(),
    position: z
        .string()
        .max(100, { message: 'Position must not be longer than 100 characters.' })
        .optional(),
    website: z
        .string()
        .url({ message: 'Please enter a valid URL.' })
        .optional()
        .or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Define the user profile type
interface UserProfile {
    id: string;
    name: string | null;
    email: string;
    bio?: string | null;
    company?: string | null;
    position?: string | null;
    website?: string | null;
}

interface ProfileFormProps {
    user: UserProfile;
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isSaving, setIsSaving] = useState(false);

    // Initialize the form with user data
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user.name || '',
            email: user.email,
            bio: user.bio || '',
            company: user.company || '',
            position: user.position || '',
            website: user.website || '',
        },
    });

    // Handle form submission
    async function onSubmit(data: ProfileFormValues) {
        setIsSaving(true);

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    ...data,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            toast({
                title: 'Profile updated',
                description: 'Your profile information has been updated successfully.',
            });

            // Mark the form as pristine again
            form.reset(data);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Update failed',
                description: 'Failed to update your profile. Please try again later.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    }

    // Check if the form has been modified
    const isFormDirty = form.formState.isDirty;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="your.email@example.com"
                                            {...field}
                                            disabled
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Contact support to change your email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us a little about yourself"
                                        className="min-h-24 resize-y"
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Brief description for your profile.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Professional Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your company" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Position</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your position" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSaving || !isFormDirty}
                    >
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Form>
    );
} 