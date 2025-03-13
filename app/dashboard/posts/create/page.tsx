"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { CalendarIcon, Clock, ImagePlus, Link as LinkIcon, Send, Save, Calendar, Facebook, Youtube } from 'lucide-react'
import { useTranslation } from '@/contexts/language-context'
import type { Language } from '@/contexts/language-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { sv, enUS } from 'date-fns/locale'
import { AuthGuard } from '@/app/components/auth-guard'

// Översättningar för skapa inlägg-sidan
const createPostTranslations = {
    en: {
        title: 'Create Post',
        description: 'Create and schedule posts for your social media accounts.',
        platform: 'Platform',
        selectPlatform: 'Select platform',
        facebook: 'Facebook',
        youtube: 'YouTube',
        postTitle: 'Post Title',
        postTitlePlaceholder: 'Enter a title for your post',
        content: 'Content',
        contentPlaceholder: 'What would you like to share?',
        addImage: 'Add Image',
        addLink: 'Add Link',
        schedule: 'Schedule',
        now: 'Now',
        later: 'Later',
        selectDate: 'Select date',
        selectTime: 'Select time',
        timezone: 'Timezone: ',
        saveDraft: 'Save Draft',
        publish: 'Publish',
        scheduleButton: 'Schedule',
        preview: 'Preview',
        settings: 'Settings',
    },
    sv: {
        title: 'Skapa Inlägg',
        description: 'Skapa och schemalägg inlägg för dina sociala medier-konton.',
        platform: 'Plattform',
        selectPlatform: 'Välj plattform',
        facebook: 'Facebook',
        youtube: 'YouTube',
        postTitle: 'Inläggstitel',
        postTitlePlaceholder: 'Ange en titel för ditt inlägg',
        content: 'Innehåll',
        contentPlaceholder: 'Vad vill du dela med dig av?',
        addImage: 'Lägg till bild',
        addLink: 'Lägg till länk',
        schedule: 'Schemalägg',
        now: 'Nu',
        later: 'Senare',
        selectDate: 'Välj datum',
        selectTime: 'Välj tid',
        timezone: 'Tidszon: ',
        saveDraft: 'Spara utkast',
        publish: 'Publicera',
        scheduleButton: 'Schemalägg',
        preview: 'Förhandsgranska',
        settings: 'Inställningar',
    },
};

export default function CreatePostPage() {
    return (
        <AuthGuard>
            <CreatePostContent />
        </AuthGuard>
    )
}

function CreatePostContent() {
    const t = useTranslation(createPostTranslations);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [scheduleOption, setScheduleOption] = useState("now");
    const language = useTranslation({ en: 'en', sv: 'sv' }) as Language;

    // Bestäm lokaliseringen för kalendern baserat på språk
    const dateLocale = language === 'sv' ? sv : enUS;

    return (
        <div className="container mx-auto py-10 max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
            <p className="text-muted-foreground mb-8">{t.description}</p>

            <Tabs defaultValue="editor" className="w-full">
                <TabsList className="mb-8">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="preview">{t.preview}</TabsTrigger>
                    <TabsTrigger value="settings">{t.settings}</TabsTrigger>
                </TabsList>

                <TabsContent value="editor">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.title}</CardTitle>
                            <CardDescription>{t.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Plattformsval */}
                            <div className="space-y-2">
                                <Label htmlFor="platform">{t.platform}</Label>
                                <Select>
                                    <SelectTrigger id="platform">
                                        <SelectValue placeholder={t.selectPlatform} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="facebook">
                                            <div className="flex items-center">
                                                <div className="mr-2 h-4 w-4 text-blue-600">
                                                    <Facebook className="h-4 w-4" />
                                                </div>
                                                {t.facebook}
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="youtube">
                                            <div className="flex items-center">
                                                <div className="mr-2 h-4 w-4 text-red-600">
                                                    <Youtube className="h-4 w-4" />
                                                </div>
                                                {t.youtube}
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Titel */}
                            <div className="space-y-2">
                                <Label htmlFor="title">{t.postTitle}</Label>
                                <Input id="title" placeholder={t.postTitlePlaceholder} />
                            </div>

                            {/* Innehåll */}
                            <div className="space-y-2">
                                <Label htmlFor="content">{t.content}</Label>
                                <Textarea
                                    id="content"
                                    placeholder={t.contentPlaceholder}
                                    className="min-h-32"
                                />
                            </div>

                            {/* Knappar för att lägga till media */}
                            <div className="flex gap-2">
                                <Button variant="outline" type="button" className="flex items-center">
                                    <ImagePlus className="mr-2 h-4 w-4" />
                                    {t.addImage}
                                </Button>
                                <Button variant="outline" type="button" className="flex items-center">
                                    <LinkIcon className="mr-2 h-4 w-4" />
                                    {t.addLink}
                                </Button>
                            </div>

                            {/* Schemaläggning */}
                            <div className="space-y-4">
                                <Label>{t.schedule}</Label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="now"
                                            name="schedule"
                                            value="now"
                                            checked={scheduleOption === "now"}
                                            onChange={() => setScheduleOption("now")}
                                            className="text-primary"
                                        />
                                        <Label htmlFor="now" className="cursor-pointer">{t.now}</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="later"
                                            name="schedule"
                                            value="later"
                                            checked={scheduleOption === "later"}
                                            onChange={() => setScheduleOption("later")}
                                            className="text-primary"
                                        />
                                        <Label htmlFor="later" className="cursor-pointer">{t.later}</Label>
                                    </div>
                                </div>

                                {scheduleOption === "later" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>{t.selectDate}</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start text-left font-normal mt-2"
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {selectedDate ? format(selectedDate, 'PPP', { locale: dateLocale }) : t.selectDate}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={selectedDate}
                                                        onSelect={setSelectedDate}
                                                        initialFocus
                                                        locale={dateLocale}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div>
                                            <Label>{t.selectTime}</Label>
                                            <div className="flex items-center mt-2">
                                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                    <Clock className="mr-2 h-4 w-4" />
                                                    {t.selectTime}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline">
                                <Save className="mr-2 h-4 w-4" />
                                {t.saveDraft}
                            </Button>
                            <div className="space-x-2">
                                {scheduleOption === "now" ? (
                                    <Button>
                                        <Send className="mr-2 h-4 w-4" />
                                        {t.publish}
                                    </Button>
                                ) : (
                                    <Button>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {t.scheduleButton}
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="preview">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.preview}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md p-4 min-h-[300px] flex items-center justify-center text-muted-foreground">
                                Preview kommer att visas här
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.settings}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md p-4 min-h-[300px] flex items-center justify-center text-muted-foreground">
                                Inställningar kommer att visas här
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 