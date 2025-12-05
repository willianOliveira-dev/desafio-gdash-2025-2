import { Download, FileText, MapPin } from 'lucide-react';
import { Button } from '../../../ui/button';

export function Header() {
    return (
        <header className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-3xl font-semibold leading-none">
                    Dashboard
                </h1>
                <p className="flex items-center gap-0.5 text-sm text-text-muted">
                    <MapPin className="size-3" />
                    Rio de Janeiro
                </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
                <Button
                    className="hover:text-white hover:bg-orange-400"
                    variant={'outline'}
                >
                    <Download className="size-5" />
                    CSV
                </Button>
                <Button
                    className="hover:text-white hover:bg-orange-400"
                    variant={'outline'}
                >
                    <FileText className="size-5" />
                    XLSX
                </Button>
            </div>
        </header>
    );
}
