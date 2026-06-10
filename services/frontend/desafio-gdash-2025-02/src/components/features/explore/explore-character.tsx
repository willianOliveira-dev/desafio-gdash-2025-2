import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { LocateFixed, MapPin } from 'lucide-react';
import type {
    Character,
    Location,
} from '@/interfaces/http/models/character.interface';
import { CharacterImage } from './character-image';

export function ExploreCharacter({ char }: { char: Character }) {
    return (
        <DialogContent className="max-md:h-screen max-w-3xl">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                    {char.name}
                </DialogTitle>
                <DialogDescription>
                    Detalhes completos do personagem
                </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="flex justify-center">
                    <CharacterImage
                        src={char.image}
                        alt={char.name}
                        className="size-48 rounded-xl object-cover shadow-md"
                    />
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-4 text-sm">
                    <InfoItem label="Status" value={char.status} />
                    <InfoItem label="Espécie" value={char.species} />
                    <InfoItem label="Gênero" value={char.gender} />
                    <InfoItem
                        label="Tipo"
                        value={char.type || 'Não informado'}
                    />
                    <InfoItem
                        label="Criado em"
                        value={new Date(char.created).toLocaleDateString()}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="border rounded-xl p-4">
                    <h3 className="flex items-center gap-2 font-semibold mb-2">
                        <MapPin className="size-3" /> Origem
                    </h3>
                    <LocationBlock location={char.origin} />
                </div>

                <div className="border rounded-xl p-4">
                    <h3 className="flex items-center gap-2  font-semibold mb-2">
                        <LocateFixed className="size-3" /> Localização Atual
                    </h3>
                    <LocationBlock location={char.location} />
                </div>
            </div>

            <DialogFooter className="mt-6">
                <span className="text-xs text-muted-foreground">
                    ID do personagem: {char.id}
                </span>
            </DialogFooter>
        </DialogContent>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

function LocationBlock({ location }: { location: Location }) {
    return (
        <div className="space-y-1 text-sm">
            <p>
                <strong>Nome:</strong> {location.name}
            </p>
            <p>
                <strong>Tipo:</strong> {location.type}
            </p>
            <p>
                <strong>Dimensão:</strong> {location.dimension}
            </p>
        </div>
    );
}
