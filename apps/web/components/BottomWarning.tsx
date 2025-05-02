import Link from "next/link";

interface BottomWarningProps {
    label: string;
    buttonText: string;
    to: string;
}

export function BottomWarning({ label, buttonText, to }: BottomWarningProps) {
    return (
        <div className="py-2 text-sm flex justify-center">
            <div>{label}</div>
            <Link className="pl-1 underline cursor-pointer" href={to}>
                {buttonText}
            </Link>
        </div>
    );
}
