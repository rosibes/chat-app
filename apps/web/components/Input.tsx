"use client";

type InputProps = {
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    reference?: any,
    className?: string,

};

export function Input({ type = "text", placeholder = "", value, onChange, label, reference, className }: InputProps) {
    return (
        <div className="flex flex-col gap-1 py-2 text-sm font-medium">
            {label && (
                <div className="text-gray-700">
                    {label}
                </div>
            )}
            <input
                type={type}
                ref={reference}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`h-12 border-2 border-purple-600 bg-neutral-100 text-base text-black 
                        shadow-[3px_3px_black] px-4 outline-none focus:border-2 
                        focus:border-purple-900 focus:shadow-none rounded-md
                        ${className || ''}`}
            />
        </div>
    );
}
