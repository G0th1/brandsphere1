import { Metadata } from 'next';
import { ApiDocumentationClient } from './client';

export const metadata: Metadata = {
    title: 'API Documentation | BrandSphereAI',
    description: 'Learn how to integrate with BrandSphereAI\'s social media APIs',
};

export default function ApiDocumentationPage() {
    return <ApiDocumentationClient />;
} 