import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
    try {
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            console.error("RESEND_API_KEY is missing");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const resend = new Resend(apiKey);
        const { name, email, message, type } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Map type to emoji and label
        const typeLabels: Record<string, string> = {
            suggestion: "💡 Feature Suggestion",
            bug: "🐛 Bug Report",
            collaboration: "🤝 Collaboration",
            other: "💬 General Inquiry",
        };

        const typeLabel = typeLabels[type] || "💬 Message";

        // Send email using Resend
        await resend.emails.send({
            from: "LinkVault Contact <onboarding@resend.dev>", // Use your verified domain
            to: ["your@email.com"], // Replace with your email
            replyTo: email,
            subject: `${typeLabel} from ${name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #8b5cf6;">New Contact Form Submission</h2>
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Type:</strong> ${typeLabel}</p>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                    </div>
                    <div style="background: #fff; padding: 20px; border-left: 4px solid #8b5cf6; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Message:</h3>
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">
                        Reply to this email to respond directly to ${name}.
                    </p>
                </div>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}
