import { useState } from 'react';

interface CharacterImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function CharacterImage({
    src,
    alt,
    className,
}: CharacterImageProps) {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const hasError = failedSrc === src;

    if (hasError || !src) {
        return (
            <div
                role="img"
                aria-label={`Imagem indisponivel para ${alt}`}
                className={`${className ?? ''} flex items-center justify-center bg-slate-200 text-slate-600 font-semibold`}
            >
                {alt.slice(0, 2).toUpperCase()}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setFailedSrc(src)}
            className={className}
        />
    );
}
