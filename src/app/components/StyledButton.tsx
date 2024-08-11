import Image from 'next/image';

const defaultClassName = 'blockin-button';

export function StyledButton({
    children,
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
}) {
    return (
        <button
            className={`${defaultClassName} mb-4 w-full ${className || ''}`}
            {...props}
        >
            <div className="flex items-center justify-center hover:opacity-80 bg-gray-800 p-4 rounded-lg">
                {children}
            </div>
        </button>
    );
}

export interface Provider {
    id: string;
    name: string;
    logo: string;
    description: string;
}

export function ProviderButtonContent({ provider }: { provider: Provider }) {
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
                <Image
                    src={provider.logo}
                    alt={provider.name}
                    className="w-6 h-6 mr-3"
                    width={32}
                    height={32}
                />
                <span>{provider.name}</span>
            </div>
            <span className="text-sm text-gray-400">
                {provider.description}
            </span>
        </div>
    );
}
