type SpinnerProps = {
    color?: string
}

const colorStyle: Record<string, string> = {
    white: "border-white",
    blue: "border-blue-500"
}

export const Spinner = ({ color = "blue" }: SpinnerProps) => {
    return (
        <div className="flex justify-center items-center">
            <div className={`w-6 h-6 border-4 border-t-transparent rounded-full animate-spin ${colorStyle[color]}`} ></div>
        </div>
    );
};
