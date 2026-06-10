import { Dialog } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { ExploreCharacter } from './explore-character';
import { CharacterImage } from './character-image';

import type { Character } from '@/interfaces/http/models/character.interface';
export function ExploreItem({ char }: { char: Character }) {
    return (
        <Dialog>
            <DialogTrigger>
                <div className="bg-white/80 rounded-3xl p-4 flex flex-col items-center cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                    <span className="text-gray-400 dark:text-gray-300 font-mono font-bold text-sm mb-2">
                        #{String(char.id).padStart(3, '0')}
                    </span>
                    <div className="size-32 lg:size-40 cursor-pointer bg-linear-to-br from-blue-200 to-blue-400 rounded-2xl overflow-hidden mb-3 flex items-center justify-center">
                        <CharacterImage
                            src={char.image}
                            alt={char.name}
                            className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    <h3 className="text-md md:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2 hover:text-blue-600 transition-colors duration-300">
                        {char.name}
                    </h3>

                    <span className="bg-yellow-300 text-yellow-900 font-semibold px-4 py-1 rounded-full text-xs shadow-sm line-clamp-1">
                        {char.type === '' ? 'unknown' : char.type}
                    </span>
                </div>
            </DialogTrigger>
            <ExploreCharacter char={char} />
        </Dialog>
    );
}
