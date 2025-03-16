"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Upload, Image, Calendar as CalendarIcon, Clock, Sparkles, Hash, BarChart, CheckCircle, AlertCircle } from 'lucide-react';
import { SocialMediaPost } from '@/services/social-media';
import { Badge } from '@/components/ui/badge';
import { ContentSuggestion, HashtagResponse, PostAnalysisResponse } from '@/services/ai-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface PostEditorProps {
    initialPost?: Partial<SocialMediaPost>;
    accounts: {
        id: string;
        platform: string;
        username: string;
        avatarUrl?: string;
    }[];
    onSave: (post: Partial<SocialMediaPost>) => Promise<void>;
    onCancel: () => void;
}

export function PostEditor({ initialPost, accounts, onSave, onCancel }: PostEditorProps) {
    const { toast } = useToast();
    const [post, setPost] = useState<Partial<SocialMediaPost>>(initialPost || {
        content: '',
        mediaUrls: [],
        platform: '',
        status: 'draft'
    });

    const [date, setDate] = useState<Date | undefined>(
        initialPost?.scheduledFor ? new Date(initialPost.scheduledFor) : undefined
    );

    const [time, setTime] = useState<string>(
        initialPost?.scheduledFor
            ? format(new Date(initialPost.scheduledFor), 'HH:mm')
            : '09:00'
    );

    const [isScheduling, setIsScheduling] = useState<boolean>(!!initialPost?.scheduledFor);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // AI states
    const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
    const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
    const [hashtags, setHashtags] = useState<HashtagResponse | null>(null);
    const [isFetchingHashtags, setIsFetchingHashtags] = useState(false);
    const [analysis, setAnalysis] = useState<PostAnalysisResponse | null>(null);
    const [isFetchingAnalysis, setIsFetchingAnalysis] = useState(false);
    const [industry, setIndustry] = useState('');
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('professional');

    // Initialize media preview
    const [mediaPreview, setMediaPreview] = useState<string[]>([]);

    // Update preview when media URLs change
    useEffect(() => {
        setMediaPreview(post.mediaUrls || []);
    }, [post.mediaUrls]);

    // Handle content change
    const handleContentChange = (content: string) => {
        setPost({ ...post, content });
    };

    // Handle platform change
    const handlePlatformChange = (platform: string) => {
        setPost({ ...post, platform });
    };

    // Handle media upload
    const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        // Simulate upload - in a real app, you'd upload to a server/cloud storage
        const newMediaUrls = Array.from(files).map(file => URL.createObjectURL(file));

        setPost({
            ...post,
            mediaUrls: [...(post.mediaUrls || []), ...newMediaUrls]
        });
    };

    // Remove media item
    const removeMedia = (index: number) => {
        const updatedUrls = [...(post.mediaUrls || [])];
        updatedUrls.splice(index, 1);
        setPost({ ...post, mediaUrls: updatedUrls });
    };

    // Handle form submission
    const handleSubmit = async (publishNow: boolean = false) => {
        try {
            setIsSubmitting(true);

            let scheduledFor: Date | undefined = undefined;

            if (isScheduling && date && time && !publishNow) {
                const [hours, minutes] = time.split(':').map(Number);
                scheduledFor = new Date(date);
                scheduledFor.setHours(hours, minutes, 0, 0);
            }

            const postToSave: Partial<SocialMediaPost> = {
                ...post,
                scheduledFor,
                status: publishNow ? 'published' : (scheduledFor ? 'scheduled' : 'draft')
            };

            await onSave(postToSave);

            toast({
                title: publishNow ? 'Post Published!' : (scheduledFor ? 'Post Scheduled!' : 'Draft Saved!'),
                description: publishNow
                    ? 'Your post has been published successfully'
                    : (scheduledFor ? `Scheduled for ${format(scheduledFor, 'PPP')} at ${format(scheduledFor, 'HH:mm')}` : 'Your draft has been saved'),
            });
        } catch (error) {
            console.error('Error saving post:', error);
            toast({
                title: 'Error',
                description: 'Failed to save post. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Generate AI content suggestions
    const generateContentSuggestions = async () => {
        if (!post.platform || !industry || !topic) {
            toast({
                title: 'Missing Information',
                description: 'Please select a platform, industry, and topic to generate suggestions.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsFetchingSuggestions(true);

            const response = await fetch('/api/ai/content-suggestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    platform: post.platform,
                    industry,
                    topic,
                    tone
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate suggestions');
            }

            const data = await response.json();
            setSuggestions(data.suggestions || []);

            toast({
                title: 'Suggestions Generated',
                description: `${data.suggestions.length} content suggestions created.`,
            });
        } catch (error) {
            console.error('Error generating content suggestions:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to generate suggestions',
                variant: 'destructive',
            });
        } finally {
            setIsFetchingSuggestions(false);
        }
    };

    // Apply a suggestion to the post content
    const applySuggestion = (suggestion: ContentSuggestion) => {
        setPost({
            ...post,
            content: suggestion.content
        });

        // If suggestion has hashtags, update them
        if (suggestion.hashtags && suggestion.hashtags.length > 0) {
            setHashtags({
                hashtags: suggestion.hashtags,
                recommended: suggestion.hashtags,
                trending: []
            });
        }
    };

    // Generate hashtag suggestions
    const generateHashtags = async () => {
        if (!post.content || !post.platform) {
            toast({
                title: 'Missing Content',
                description: 'Please add content and select a platform to generate hashtags.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsFetchingHashtags(true);

            const response = await fetch('/api/ai/hashtags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: post.content,
                    platform: post.platform
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate hashtags');
            }

            const data = await response.json();
            setHashtags(data);

            toast({
                title: 'Hashtags Generated',
                description: `${data.hashtags.length} hashtags generated.`,
            });
        } catch (error) {
            console.error('Error generating hashtags:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to generate hashtags',
                variant: 'destructive',
            });
        } finally {
            setIsFetchingHashtags(false);
        }
    };

    // Apply hashtags to the post content
    const applyHashtags = (selectedHashtags: string[]) => {
        const hashtagText = selectedHashtags.map(tag => `#${tag.replace(/^#/, '')}`).join(' ');

        // Add hashtags to the end of the content
        setPost({
            ...post,
            content: `${post.content}\n\n${hashtagText}`
        });
    };

    // Analyze post content
    const analyzePost = async () => {
        if (!post.content || !post.platform) {
            toast({
                title: 'Missing Content',
                description: 'Please add content and select a platform to analyze.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsFetchingAnalysis(true);

            const response = await fetch('/api/ai/analyze-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: post.content,
                    platform: post.platform
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to analyze post');
            }

            const data = await response.json();
            setAnalysis(data);

            toast({
                title: 'Analysis Complete',
                description: 'Post analysis and suggestions generated.',
            });
        } catch (error) {
            console.error('Error analyzing post:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to analyze post',
                variant: 'destructive',
            });
        } finally {
            setIsFetchingAnalysis(false);
        }
    };

    // Function to get sentiment badge color
    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case 'positive':
                return 'bg-green-500';
            case 'negative':
                return 'bg-red-500';
            case 'neutral':
            default:
                return 'bg-blue-500';
        }
    };

    // Function to get engagement badge color
    const getEngagementColor = (level: string) => {
        switch (level) {
            case 'high':
                return 'bg-green-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{initialPost ? 'Edit Post' : 'Create New Post'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Platform Selection */}
                <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                        value={post.platform}
                        onValueChange={handlePlatformChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map(account => (
                                <SelectItem key={account.id} value={account.platform.toLowerCase()}>
                                    <div className="flex items-center">
                                        <Avatar className="h-6 w-6 mr-2">
                                            <AvatarImage src={account.avatarUrl} alt={account.username} />
                                            <AvatarFallback>{account.platform.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{account.platform} - {account.username}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Tabs defaultValue="editor">
                    <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="editor">Content Editor</TabsTrigger>
                        <TabsTrigger value="ai">AI Assistant</TabsTrigger>
                        <TabsTrigger value="media">Media & Scheduling</TabsTrigger>
                    </TabsList>

                    {/* Editor Tab */}
                    <TabsContent value="editor" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="What's on your mind?"
                                value={post.content}
                                onChange={(e) => handleContentChange(e.target.value)}
                                className="min-h-[200px]"
                            />
                        </div>

                        {/* Hashtag Suggestions */}
                        {hashtags && (
                            <div className="border rounded-md p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-md font-medium flex items-center">
                                        <Hash className="w-4 h-4 mr-2" />
                                        Hashtag Suggestions
                                    </h3>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => applyHashtags(hashtags.recommended)}
                                    >
                                        Apply Recommended
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <span className="text-sm font-medium">Trending:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {hashtags.trending.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    className="cursor-pointer bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-100"
                                                    onClick={() => applyHashtags([tag])}
                                                >
                                                    #{tag.replace(/^#/, '')}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-sm font-medium">Recommended:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {hashtags.recommended.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    className="cursor-pointer"
                                                    onClick={() => applyHashtags([tag])}
                                                >
                                                    #{tag.replace(/^#/, '')}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-sm font-medium">All Suggestions:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {hashtags.hashtags.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="cursor-pointer"
                                                    onClick={() => applyHashtags([tag])}
                                                >
                                                    #{tag.replace(/^#/, '')}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Post Analysis */}
                        {analysis && (
                            <div className="border rounded-md p-4 space-y-3">
                                <h3 className="text-md font-medium flex items-center">
                                    <BarChart className="w-4 h-4 mr-2" />
                                    Content Analysis
                                </h3>

                                <div className="flex flex-wrap gap-2">
                                    <Badge className={`${getSentimentColor(analysis.sentiment)}`}>
                                        Sentiment: {analysis.sentiment}
                                    </Badge>
                                    <Badge className={`${getEngagementColor(analysis.predictedEngagement)}`}>
                                        Expected Engagement: {analysis.predictedEngagement}
                                    </Badge>
                                    {analysis.recommendedTime && (
                                        <Badge variant="outline">
                                            Recommended Time: {analysis.recommendedTime}
                                        </Badge>
                                    )}
                                </div>

                                <div>
                                    <span className="text-sm font-medium">Improvement Suggestions:</span>
                                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                                        {analysis.suggestions.map((suggestion, index) => (
                                            <li key={index}>{suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between pt-2">
                            <div>
                                <Button
                                    variant="outline"
                                    onClick={generateHashtags}
                                    disabled={!post.content || !post.platform || isFetchingHashtags}
                                >
                                    {isFetchingHashtags ? (
                                        <>Generating Hashtags...</>
                                    ) : (
                                        <>
                                            <Hash className="w-4 h-4 mr-2" />
                                            Generate Hashtags
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div>
                                <Button
                                    variant="outline"
                                    onClick={analyzePost}
                                    disabled={!post.content || !post.platform || isFetchingAnalysis}
                                    className="ml-2"
                                >
                                    {isFetchingAnalysis ? (
                                        <>Analyzing...</>
                                    ) : (
                                        <>
                                            <BarChart className="w-4 h-4 mr-2" />
                                            Analyze Content
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    {/* AI Assistant Tab */}
                    <TabsContent value="ai" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="industry">Industry</Label>
                                <Select value={industry} onValueChange={setIndustry}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="technology">Technology</SelectItem>
                                        <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                                        <SelectItem value="food">Food & Beverage</SelectItem>
                                        <SelectItem value="health">Health & Wellness</SelectItem>
                                        <SelectItem value="travel">Travel & Hospitality</SelectItem>
                                        <SelectItem value="finance">Finance</SelectItem>
                                        <SelectItem value="education">Education</SelectItem>
                                        <SelectItem value="entertainment">Entertainment</SelectItem>
                                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                                        <SelectItem value="b2b">B2B</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="topic">Topic</Label>
                                <Input
                                    id="topic"
                                    placeholder="e.g., Product launch, seasonal sale, tips"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="tone">Content Tone</Label>
                            <Select value={tone} onValueChange={setTone}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select tone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="casual">Casual & Friendly</SelectItem>
                                    <SelectItem value="humorous">Humorous</SelectItem>
                                    <SelectItem value="inspirational">Inspirational</SelectItem>
                                    <SelectItem value="educational">Educational</SelectItem>
                                    <SelectItem value="promotional">Promotional</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={generateContentSuggestions}
                            disabled={!post.platform || !industry || !topic || isFetchingSuggestions}
                            className="w-full"
                        >
                            {isFetchingSuggestions ? (
                                <>Generating Content Ideas...</>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Content Ideas
                                </>
                            )}
                        </Button>

                        {/* Content Suggestions */}
                        {isFetchingSuggestions ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i}>
                                        <CardContent className="p-4 space-y-3">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-20 w-full" />
                                            <div className="flex space-x-2">
                                                <Skeleton className="h-6 w-16" />
                                                <Skeleton className="h-6 w-16" />
                                                <Skeleton className="h-6 w-16" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {suggestions.map((suggestion, index) => (
                                    <Card key={index}>
                                        <CardContent className="p-4 space-y-3">
                                            <p>{suggestion.content}</p>

                                            {suggestion.hashtags && suggestion.hashtags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {suggestion.hashtags.map((tag, i) => (
                                                        <Badge key={i} variant="secondary">#{tag.replace(/^#/, '')}</Badge>
                                                    ))}
                                                </div>
                                            )}

                                            {suggestion.bestPostingTime && (
                                                <div className="text-sm text-muted-foreground flex items-center">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    Best time: {suggestion.bestPostingTime}
                                                </div>
                                            )}

                                            <Button
                                                onClick={() => applySuggestion(suggestion)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Use This Content
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Media & Scheduling Tab */}
                    <TabsContent value="media" className="space-y-4">
                        {/* Media Upload */}
                        <div className="space-y-2">
                            <Label>Media</Label>
                            <div className="border border-dashed rounded-md p-6 text-center">
                                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground mb-2">
                                    Drag & drop media files or click to upload
                                </p>
                                <Input
                                    type="file"
                                    accept="image/*,video/*"
                                    className="hidden"
                                    id="media-upload"
                                    multiple
                                    onChange={handleMediaUpload}
                                />
                                <Button asChild variant="outline" size="sm">
                                    <label htmlFor="media-upload">
                                        <Image className="w-4 h-4 mr-2" />
                                        Select Files
                                    </label>
                                </Button>
                            </div>

                            {/* Media Preview */}
                            {mediaPreview.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                                    {mediaPreview.map((url, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={url}
                                                alt={`Preview ${index}`}
                                                className="w-full h-24 object-cover rounded"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6"
                                                onClick={() => removeMedia(index)}
                                            >
                                                <span>×</span>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Scheduling Options */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="schedule-toggle">Schedule Post</Label>
                                <Switch
                                    id="schedule-toggle"
                                    checked={isScheduling}
                                    onCheckedChange={setIsScheduling}
                                />
                            </div>

                            {isScheduling && (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Time</Label>
                                        <Input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Post Notifications */}
                        <div className="space-y-2 border-t pt-4">
                            <h3 className="text-md font-medium">Post Notifications</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="engagement-reminder" className="text-sm">
                                            Engagement Reminder
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Get reminded to check comments after publishing
                                        </p>
                                    </div>
                                    <Switch id="engagement-reminder" defaultChecked={true} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="performance-notification" className="text-sm">
                                            Performance Alert
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Receive notification about post performance
                                        </p>
                                    </div>
                                    <Switch id="performance-notification" defaultChecked={true} />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>

            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit(false)}
                        disabled={isSubmitting}
                    >
                        {isScheduling ? 'Schedule' : 'Save Draft'}
                    </Button>
                    <Button
                        onClick={() => handleSubmit(true)}
                        disabled={isSubmitting || !post.content}
                    >
                        {isSubmitting ? 'Saving...' : 'Publish Now'}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
} 