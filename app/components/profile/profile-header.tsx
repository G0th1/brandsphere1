"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Mail, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';

interface UserProfile {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: Date;
    subscription?: {
        plan: string;
        status: string;
    } | null;
}

interface ProfileHeaderProps {
    user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
    const [isUploading, setIsUploading] = useState(false);

    // Function to handle profile image upload
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Please upload an image smaller than 5MB",
                variant: "destructive",
            });
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Invalid file type",
                description: "Please upload an image file",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);

        try {
            // Create FormData
            const formData = new FormData();
            formData.append('profileImage', file);
            formData.append('userId', user.id);

            // Send to API
            const response = await fetch('/api/user/profile-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            // Show success message
            toast({
                title: "Profile image updated",
                description: "Your profile image has been updated successfully",
            });

            // Reload the page to see the changes
            window.location.reload();
        } catch (error) {
            console.error('Error uploading profile image:', error);
            toast({
                title: "Upload failed",
                description: "Failed to upload profile image. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    // Generate initials for avatar fallback
    const getInitials = () => {
        if (!user.name) return user.email.charAt(0).toUpperCase();
        return user.name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

    // Format account creation date
    const memberSince = formatDistanceToNow(new Date(user.createdAt), { addSuffix: true });

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="relative group">
                        <Avatar className="h-24 w-24 border-4 border-background">
                            <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                            <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                        </Avatar>

                        <label className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground p-1 cursor-pointer shadow hover:bg-primary/90 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                            />
                            {isUploading ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            )}
                        </label>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-semibold">{user.name || 'User'}</h1>

                        <div className="flex flex-col md:flex-row gap-2 mt-2 text-muted-foreground text-sm">
                            <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>

                            <div className="hidden md:block">•</div>

                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Member {memberSince}</span>
                            </div>
                        </div>

                        {user.subscription && (
                            <div className="mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                    {user.subscription.plan} Plan
                                </span>

                                {user.subscription.status !== 'active' && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                        {user.subscription.status}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="md:self-start md:ml-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-5 w-5" />
                                    <span className="sr-only">More options</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Profile Options</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => window.print()}>
                                    Export Profile Data
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => {
                                        toast({
                                            title: "Feature coming soon",
                                            description: "Account deletion will be available in a future update.",
                                        });
                                    }}
                                >
                                    Delete Account
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 