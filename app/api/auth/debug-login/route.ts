import { NextRequest } from "next/server";
import { safeJsonResponse } from "@/lib/api-utils";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/lib/auth";
import { hash } from "bcrypt";

/**
 * Debug Login API
 * This endpoint helps diagnose login issues by providing detailed information
 * about the authentication process.
 */
export async function POST(req: NextRequest) {
    const debugResults = {
        userLookup: { success: false, details: null },
        passwordVerification: { success: false, details: null },
        passwordReset: { success: false, details: null },
        hash: null,
        recommendations: []
    };

    try {
        // Parse request body
        const body = await req.json();
        const { email, password } = body;

        console.log(`🔍 DEBUG LOGIN: Attempting diagnosis for ${email}`);

        if (!email || !password) {
            return safeJsonResponse({
                error: "MissingCredentials",
                message: "Email and password are required for diagnosis",
                status: "error"
            }, { status: 400 });
        }

        // Step 1: Find the user in the database
        try {
            const user = await prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    password_hash: true,
                    role: true,
                    name: true,
                    created_at: true
                }
            });

            if (user) {
                debugResults.userLookup.success = true;
                debugResults.userLookup.details = {
                    id: user.id,
                    found: true,
                    email: user.email,
                    role: user.role,
                    hashExists: !!user.password_hash,
                    hashLength: user.password_hash?.length || 0,
                    hashFormat: user.password_hash?.startsWith('$2') ? 'Valid bcrypt' : 'Invalid format',
                    created: user.created_at
                };

                // Step 2: Try password verification
                try {
                    if (user.password_hash) {
                        const passwordValid = await compare(password, user.password_hash);

                        debugResults.passwordVerification.success = passwordValid;
                        debugResults.passwordVerification.details = {
                            methodUsed: 'bcrypt.compare',
                            result: passwordValid ? 'Valid' : 'Invalid',
                            passwordLength: password.length,
                            hashPreview: `${user.password_hash.substring(0, 10)}...`
                        };

                        if (!passwordValid) {
                            // If password verification fails, offer to reset it
                            const newHash = await hash(password, 10);
                            debugResults.hash = newHash;
                            debugResults.recommendations.push(
                                "The password verification failed. You may want to reset your password."
                            );
                        } else {
                            debugResults.recommendations.push(
                                "Password verification succeeded but login still fails. This suggests an issue in the login flow."
                            );
                        }
                    } else {
                        debugResults.passwordVerification.details = {
                            methodUsed: 'none',
                            result: 'Failed - No password hash stored',
                            passwordLength: password.length
                        };

                        // If no password hash exists, offer to set one
                        const newHash = await hash(password, 10);
                        debugResults.hash = newHash;
                        debugResults.recommendations.push(
                            "No password hash exists for this user. You may want to set a password."
                        );
                    }
                } catch (verifyError) {
                    debugResults.passwordVerification.details = {
                        methodUsed: 'bcrypt.compare',
                        result: 'Error',
                        error: verifyError.message
                    };

                    debugResults.recommendations.push(
                        "There was an error verifying the password. The hash might be in an invalid format."
                    );
                }

                // Step 3: Offer to reset the password if verification failed or errored
                if (!debugResults.passwordVerification.success) {
                    try {
                        // Generate a new hash and offer it as a solution
                        const newHash = await hash(password, 10);

                        // Store the hash for the user
                        const updateResult = await prisma.user.update({
                            where: { id: user.id },
                            data: { password_hash: newHash }
                        });

                        debugResults.passwordReset.success = true;
                        debugResults.passwordReset.details = {
                            newHashPreview: `${newHash.substring(0, 10)}...`,
                            message: "Password has been reset with the provided value."
                        };

                        debugResults.recommendations.push(
                            "Password has been automatically reset. Please try logging in again."
                        );
                    } catch (resetError) {
                        debugResults.passwordReset.details = {
                            error: resetError.message
                        };

                        debugResults.recommendations.push(
                            "Failed to reset password automatically. You may need to use the password reset flow."
                        );
                    }
                }
            } else {
                debugResults.userLookup.details = {
                    found: false,
                    error: "User not found with the provided email"
                };

                debugResults.recommendations.push(
                    "No user found with this email. Please check the email address or create a new account."
                );
            }
        } catch (lookupError) {
            debugResults.userLookup.details = {
                error: lookupError.message
            };

            debugResults.recommendations.push(
                "There was an error looking up the user. Database connection may be unavailable."
            );
        }

        // Return diagnostic results
        return safeJsonResponse({
            status: "success",
            message: "Diagnostic completed. See results for details.",
            results: debugResults
        });
    } catch (error) {
        console.error("Debug login error:", error);
        return safeJsonResponse({
            error: "DiagnosticError",
            message: "Error running login diagnostics",
            status: "error",
            details: error.message
        }, { status: 500 });
    }
} 