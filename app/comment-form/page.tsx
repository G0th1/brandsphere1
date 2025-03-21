import { neon } from '@neondatabase/serverless';

// Server Action for inserting data
async function create(formData: FormData) {
    'use server';

    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    const comment = formData.get('comment');

    try {
        // Create the comments table if it doesn't exist
        await sql`CREATE TABLE IF NOT EXISTS comments (comment TEXT)`;

        // Insert the comment from the form into the Postgres database
        await sql`INSERT INTO comments (comment) VALUES (${comment})`;

        return { status: 'success', message: 'Comment added successfully!' };
    } catch (error) {
        console.error('Error saving comment:', error);
        return { status: 'error', message: error.message };
    }
}

export default function CommentFormPage() {
    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Neon Database Comment Form</h1>

            <form action={create} className="space-y-4">
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium mb-1">
                        Write a comment
                    </label>
                    <textarea
                        id="comment"
                        name="comment"
                        rows={4}
                        className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your comment here..."
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Submit Comment
                </button>
            </form>

            <div className="mt-8 text-sm text-gray-600">
                <p>This form demonstrates using Neon's serverless driver with Next.js Server Actions.</p>
                <p className="mt-2">After submitting, your comment will be stored in the Neon PostgreSQL database.</p>
            </div>
        </div>
    );
} 