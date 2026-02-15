import Link from "next/link";

export default function FooterLoginButton() {
    return (
        <Link
            href="/login"
            className="hover:text-white transition-colors"
        >
            Sign In
        </Link>
    );
}
