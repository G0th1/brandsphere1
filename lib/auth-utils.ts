import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";

/**
 * Gets the current session server-side
 * Use this in Server Components or Route Handlers
 */
export async function getSession() {
    return await getServerSession(authOptions);
}

/**
 * Gets the current user from the session
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
    const session = await getSession();
    return session?.user || null;
}

/**
 * Server-side authentication check
 * Redirects to login if not authenticated
 */
export async function requireAuth() {
    const session = await getSession();

    if (!session) {
        redirect("/auth/login");
    }

    return session.user;
}

/**
 * Server-side admin check
 * Redirects to dashboard if not an admin
 */
export async function requireAdmin() {
    const user = await requireAuth();

    if (user.role !== "admin") {
        redirect("/dashboard");
    }

    return user;
}

/**
 * Returns boolean if user is authenticated
 * Doesn't redirect
 */
export async function isAuthenticated() {
    const session = await getSession();
    return !!session;
} 