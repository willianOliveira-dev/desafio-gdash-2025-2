import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiErrorSchema } from '@/http/schemas/api-error.schema';
import type { ExplorePagination } from '@/interfaces/http/models/explore-pagination.interface';
import { ExploreItem } from './explore-item';
import { Button } from '@/components/ui/button';
import { ExploreItemSkeleton } from './explore-item-skeleton';

export function ExploreList() {
    const SKELETON_ITEMS = Array.from({ length: 20 }, (_, index) => index);
    const [name, setName] = useState<string>('');
    const [debouncedName, setDebouncedName] = useState<string>('');
    const [status, setStatus] = useState<'alive' | 'dead' | 'unknown' | ''>('');
    const [gender, setGender] = useState<
        'female' | 'male' | 'genderless' | 'unknown' | ''
    >('');
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedName(name.trim());
        }, 400);

        return () => window.clearTimeout(timeout);
    }, [name]);

    const { data, error, isError, isFetching, isLoading, refetch } = useQuery({
        queryKey: ['explore', debouncedName, status, gender, page],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.set('page', String(page));
            if (debouncedName) params.set('name', debouncedName);
            if (status) params.set('status', status);
            if (gender) params.set('gender', gender);

            const res = await api<ExplorePagination>(
                `explore/character?${params.toString()}`
            );
            return res.data;
        },
        placeholderData: keepPreviousData,
        retry: 1,
    });

    const parsedError = apiErrorSchema.safeParse(error);
    const errorMessage = parsedError.success
        ? parsedError.data.message
        : 'Nao foi possivel buscar os personagens.';

    return (
        <div className="space-y-4">
            <div className="flex flex-col xl:flex-row gap-2">
                <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setPage(1);
                    }}
                    className="border rounded p-2 flex-1"
                />
                <div className="space-x-2.5">
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(
                                e.target.value as
                                    | 'alive'
                                    | 'dead'
                                    | 'unknown'
                                    | ''
                            );
                            setPage(1);
                        }}
                        className="border rounded p-2"
                    >
                        <option value="">Status</option>
                        <option value="alive">Alive</option>
                        <option value="dead">Dead</option>
                        <option value="unknown">Unknown</option>
                    </select>

                    <select
                        value={gender}
                        onChange={(e) => {
                            setGender(
                                e.target.value as
                                    | 'female'
                                    | 'male'
                                    | 'genderless'
                                    | 'unknown'
                                    | ''
                            );
                            setPage(1);
                        }}
                        className="border rounded p-2"
                    >
                        <option value="">Gênero</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="genderless">Genderless</option>
                        <option value="unknown">Unknown</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {SKELETON_ITEMS.map((item) => (
                        <ExploreItemSkeleton key={item} />
                    ))}
                </ul>
            ) : isError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    <p>{errorMessage}</p>
                    <Button
                        variant="outline"
                        className="mt-3"
                        onClick={() => refetch()}
                    >
                        Tentar novamente
                    </Button>
                </div>
            ) : data && data.results.length > 0 ? (
                <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {data.results.map((char) => (
                        <ExploreItem key={char.id} char={char} />
                    ))}
                </ul>
            ) : (
                <p>Nenhum personagem encontrado.</p>
            )}

            {isFetching && !isLoading ? (
                <p className="text-center text-xs text-muted-foreground">
                    Atualizando resultados...
                </p>
            ) : null}

            {data && data.info.pages > 0 ? (
                <div className="flex items-center justify-center w-full  pt-2 border-t">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setPage((prev) => prev - 1)}
                            disabled={!data.info.prev}
                        >
                            Anterior
                        </Button>

                        <p className="text-xs">
                            Página {page} de {data.info.pages}
                        </p>

                        <Button
                            variant="outline"
                            onClick={() => setPage((prev) => prev + 1)}
                            disabled={!data.info.next}
                        >
                            Próxima
                        </Button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
