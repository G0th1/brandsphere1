"use client";

import { useState } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Mail, Edit, Trash2, Loader2, Filter, MoreHorizontal, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock team members data
const mockTeamMembers = [
    {
        id: '1',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        role: 'Admin',
        joinedDate: '2023-01-15',
        avatar: '/images/avatars/alex.jpg',
        status: 'active'
    },
    {
        id: '2',
        name: 'Sam Taylor',
        email: 'sam@example.com',
        role: 'Editor',
        joinedDate: '2023-02-20',
        avatar: '/images/avatars/sam.jpg',
        status: 'active'
    },
    {
        id: '3',
        name: 'Jordan Lee',
        email: 'jordan@example.com',
        role: 'Viewer',
        joinedDate: '2023-03-10',
        avatar: '/images/avatars/jordan.jpg',
        status: 'pending'
    },
    {
        id: '4',
        name: 'Jamie Smith',
        email: 'jamie@example.com',
        role: 'Editor',
        joinedDate: '2023-04-05',
        avatar: '/images/avatars/jamie.jpg',
        status: 'active'
    }
];

// User roles
const roles = [
    { value: 'admin', label: 'Admin', description: 'Full access to all settings and features' },
    { value: 'editor', label: 'Editor', description: 'Can create and publish content' },
    { value: 'viewer', label: 'Viewer', description: 'View-only access to content' }
];

export default function TeamPage() {
    const { toast } = useToast();
    const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('editor');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock function to add a new team member
    const handleAddMember = () => {
        setIsAddingMember(true);

        // Validation
        if (!newMemberEmail || !newMemberEmail.includes('@')) {
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address",
                variant: "destructive"
            });
            setIsAddingMember(false);
            return;
        }

        // Check if email already exists
        if (teamMembers.some(member => member.email === newMemberEmail)) {
            toast({
                title: "Duplicate Email",
                description: "This email has already been invited",
                variant: "destructive"
            });
            setIsAddingMember(false);
            return;
        }

        // Simulate API call delay
        setTimeout(() => {
            const newMember = {
                id: Date.now().toString(),
                name: newMemberEmail.split('@')[0], // Default name from email
                email: newMemberEmail,
                role: roles.find(r => r.value === newMemberRole)?.label || 'Editor',
                joinedDate: new Date().toISOString().split('T')[0],
                avatar: '',
                status: 'pending'
            };

            setTeamMembers([...teamMembers, newMember]);
            setNewMemberEmail('');
            setNewMemberRole('editor');
            setIsAddingMember(false);

            toast({
                title: "Invitation Sent",
                description: `Invitation email sent to ${newMemberEmail}`
            });
        }, 1500);
    };

    // Remove team member
    const handleRemoveMember = (id: string) => {
        setTeamMembers(teamMembers.filter(member => member.id !== id));

        toast({
            title: "Member Removed",
            description: "Team member has been removed"
        });
    };

    // Filter team members based on search query
    const filteredMembers = teamMembers.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Team</h1>
                    <p className="text-muted-foreground">Manage your team members and their permissions</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            <span>Invite Member</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite Team Member</DialogTitle>
                            <DialogDescription>
                                Add a new team member to your workspace. They will receive an email invitation.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="colleague@example.com"
                                    value={newMemberEmail}
                                    onChange={(e) => setNewMemberEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map(role => (
                                            <SelectItem key={role.value} value={role.value}>
                                                <div className="flex flex-col">
                                                    <span>{role.label}</span>
                                                    <span className="text-xs text-muted-foreground">{role.description}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setNewMemberEmail('')}>Cancel</Button>
                            <Button onClick={handleAddMember} disabled={isAddingMember}>
                                {isAddingMember ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Invitation...
                                    </>
                                ) : "Send Invitation"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Team Members</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search members..."
                                    className="pl-8 w-[200px]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="grid grid-cols-12 p-4 font-medium border-b">
                            <div className="col-span-4 lg:col-span-3">Name</div>
                            <div className="col-span-4 lg:col-span-3">Role</div>
                            <div className="hidden lg:block lg:col-span-3">Status</div>
                            <div className="col-span-4 lg:col-span-3 text-right">Actions</div>
                        </div>

                        {filteredMembers.length > 0 ? (
                            filteredMembers.map(member => (
                                <div key={member.id} className="grid grid-cols-12 p-4 items-center border-b last:border-0">
                                    <div className="col-span-4 lg:col-span-3 flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{member.name}</div>
                                            <div className="text-sm text-muted-foreground">{member.email}</div>
                                        </div>
                                    </div>

                                    <div className="col-span-4 lg:col-span-3">
                                        <Badge variant={
                                            member.role === 'Admin' ? 'default' :
                                                member.role === 'Editor' ? 'secondary' : 'outline'
                                        }>
                                            {member.role}
                                        </Badge>
                                    </div>

                                    <div className="hidden lg:block lg:col-span-3">
                                        <Badge variant={member.status === 'active' ? 'default' : 'outline'}>
                                            {member.status === 'active' ? 'Active' : 'Pending'}
                                        </Badge>
                                    </div>

                                    <div className="col-span-4 lg:col-span-3 flex justify-end gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive/90"
                                            onClick={() => handleRemoveMember(member.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <Users className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                                <div className="font-medium">No team members found</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {searchQuery ? "Try a different search term" : "Add your first team member to get started"}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Roles and Permissions</CardTitle>
                    <CardDescription>Learn about our different team roles and what they can do</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-3">
                        {roles.map(role => (
                            <div key={role.value} className="border rounded-lg p-4">
                                <h3 className="font-medium mb-1">{role.label}</h3>
                                <p className="text-sm text-muted-foreground">{role.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 