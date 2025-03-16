"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert';

// Define the password form schema with validation
const passwordFormSchema = z
    .object({
        currentPassword: z.string().min(1, { message: 'Current password is required.' }),
        newPassword: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters.' })
            .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
            .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
            .regex(/[0-9]/, { message: 'Password must contain at least one number.' }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

// Define the security preferences form schema
const securityPreferencesSchema = z.object({
    twoFactorEnabled: z.boolean().default(false),
    loginNotifications: z.boolean().default(true),
    sessionTimeout: z.boolean().default(false),
});

type SecurityPreferencesValues = z.infer<typeof securityPreferencesSchema>;

interface SecuritySettingsProps {
    userId: string;
}

export function SecuritySettings({ userId }: SecuritySettingsProps) {
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isSavingPreferences, setIsSavingPreferences] = useState(false);

    // Initialize the password form
    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    // Initialize the security preferences form
    const preferencesForm = useForm<SecurityPreferencesValues>({
        resolver: zodResolver(securityPreferencesSchema),
        defaultValues: {
            twoFactorEnabled: false,
            loginNotifications: true,
            sessionTimeout: false,
        },
    });

    // Handle password form submission
    async function onPasswordSubmit(data: PasswordFormValues) {
        setIsChangingPassword(true);

        try {
            const response = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to change password');
            }

            toast({
                title: 'Password changed',
                description: 'Your password has been changed successfully.',
            });

            // Reset the form
            passwordForm.reset({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            console.error('Error changing password:', error);
            toast({
                title: 'Password change failed',
                description: 'Failed to change your password. Please check your current password and try again.',
                variant: 'destructive',
            });
        } finally {
            setIsChangingPassword(false);
        }
    }

    // Handle security preferences form submission
    async function onPreferencesSubmit(data: SecurityPreferencesValues) {
        setIsSavingPreferences(true);

        try {
            const response = await fetch('/api/user/security-preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    ...data,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update security preferences');
            }

            toast({
                title: 'Security preferences updated',
                description: 'Your security preferences have been updated successfully.',
            });
        } catch (error) {
            console.error('Error updating security preferences:', error);
            toast({
                title: 'Update failed',
                description: 'Failed to update your security preferences. Please try again later.',
                variant: 'destructive',
            });
        } finally {
            setIsSavingPreferences(false);
        }
    }

    return (
        <div className="space-y-6">
            <Alert className="bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Keep your account secure</AlertTitle>
                <AlertDescription>
                    Regularly update your password and enable additional security features to protect your account.
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        Update your password to maintain account security
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Password must be at least 8 characters with uppercase, lowercase, and numbers.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isChangingPassword}
                                className="w-full md:w-auto"
                            >
                                {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Security Preferences</CardTitle>
                    <CardDescription>
                        Configure additional security settings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...preferencesForm}>
                        <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-4">
                            <FormField
                                control={preferencesForm.control}
                                name="twoFactorEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                                            <FormDescription>
                                                Add an extra layer of security to your account by requiring a verification code in addition to your password.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled
                                            />
                                        </FormControl>
                                        {field.value && (
                                            <p className="text-xs text-muted-foreground mt-2 absolute top-4 right-14">
                                                Coming soon
                                            </p>
                                        )}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={preferencesForm.control}
                                name="loginNotifications"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Login Notifications</FormLabel>
                                            <FormDescription>
                                                Receive email notifications when your account is accessed from a new device or location.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={preferencesForm.control}
                                name="sessionTimeout"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Session Timeout</FormLabel>
                                            <FormDescription>
                                                Automatically log out after 30 minutes of inactivity for enhanced security.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isSavingPreferences || !preferencesForm.formState.isDirty}
                                className="mt-2"
                            >
                                {isSavingPreferences && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSavingPreferences ? 'Saving...' : 'Save Preferences'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200">
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Security Tips</AlertTitle>
                <AlertDescription>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Use unique passwords for different accounts</li>
                        <li>Never share your password with anyone</li>
                        <li>Be cautious of phishing attempts</li>
                        <li>Keep your device and browser updated</li>
                    </ul>
                </AlertDescription>
            </Alert>
        </div>
    );
} 