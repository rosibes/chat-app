interface HeadingProps {
    label: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | '2xl' | '3xl' | '4xl' | '5xl';
    align?: 'left' | 'center' | 'right';
    style?: 'bold' | 'regular'
}

const sizeStyles = {
    'sm': 'text-sm',
    'md': 'text-md',
    'lg': 'text-lg',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
};

const textStyles = {
    "bold": "font-bold",
    "regular": "font-normal",
}

const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

export function Heading({ label, className = '', size = '4xl', align = 'left', style = 'regular' }: HeadingProps) {
    return (
        <div
            className={`font-bold pt-6 ${sizeStyles[size]} ${textStyles[style]} ${alignStyles[align]} ${className}`}
        >
            {label}
        </div>
    );
}