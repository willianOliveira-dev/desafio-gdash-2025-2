import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom, map } from 'rxjs'
import { isAxiosError } from 'axios'
import { QueryParamApiExternal } from '../dto/query-param-api-external.dto'
import type { CharacterSchema } from '../interfaces/character-schema.interface'
import type { CharacterSchemaPagination } from '../interfaces/character-schema-paginationl.interface'
import type { LocationSchema } from '../interfaces/location-schema.interface'

interface ExternalLocationReference {
  name: string
  url: string
}

interface ExternalCharacter {
  id: number
  name: string
  status: CharacterSchema['status']
  species: string
  type: string
  gender: CharacterSchema['gender']
  origin: ExternalLocationReference
  location: ExternalLocationReference
  image: string
  created: string
}

interface ExternalCharacterPage {
  info: {
    count: number
    pages: number
    next: string | null
    prev: string | null
  }
  results: ExternalCharacter[]
}

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

@Injectable()
export class ExploreService {
  private readonly baseURL: string = 'https://rickandmortyapi.com/api'
  private readonly cacheTtlMs = 5 * 60 * 1000
  private readonly pageCache = new Map<
    string,
    CacheEntry<CharacterSchemaPagination>
  >()

  constructor(private readonly httpService: HttpService) {}

  private getCachedPage(key: string): CharacterSchemaPagination | null {
    const cached = this.pageCache.get(key)

    if (!cached) return null

    if (cached.expiresAt <= Date.now()) {
      this.pageCache.delete(key)
      return null
    }

    return cached.data
  }

  private cachePage(key: string, data: CharacterSchemaPagination): void {
    this.pageCache.set(key, {
      data,
      expiresAt: Date.now() + this.cacheTtlMs,
    })
  }

  private unknownLocation(
    reference?: ExternalLocationReference,
  ): LocationSchema {
    const id = reference?.url
      ? Number(new URL(reference.url).pathname.split('/').at(-1))
      : 0

    return {
      id: Number.isNaN(id) ? 0 : id,
      name: reference?.name || 'unknown',
      type: 'unknown',
      dimension: 'unknown',
      created: 'unknown',
    }
  }

  private async fetchLocation(url: string | null): Promise<LocationSchema> {
    try {
      if (!url) {
        return this.unknownLocation()
      }

      const responseLocation = this.httpService
        .get(url)
        .pipe(map((res) => res.data))
      const locationData = await firstValueFrom(responseLocation)

      const location: LocationSchema = {
        id: locationData.id,
        name: locationData.name,
        type: locationData.type,
        dimension: locationData.dimension,
        created: locationData.created,
      }

      return location
    } catch (error) {
      throw new HttpException(
        'Houve um erro ao buscar localização.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  private async fetchLocations(
    characters: ExternalCharacter[],
  ): Promise<Map<number, LocationSchema>> {
    const ids = new Set<number>()

    for (const character of characters) {
      for (const reference of [character.origin, character.location]) {
        if (!reference.url) continue

        const id = Number(new URL(reference.url).pathname.split('/').at(-1))
        if (!Number.isNaN(id)) ids.add(id)
      }
    }

    if (ids.size === 0) return new Map()

    try {
      const response = this.httpService
        .get<LocationSchema | LocationSchema[]>(
          `${this.baseURL}/location/${Array.from(ids).join(',')}`,
        )
        .pipe(map((res) => res.data))
      const data = await firstValueFrom(response)
      const locations = Array.isArray(data) ? data : [data]

      return new Map(locations.map((location) => [location.id, location]))
    } catch {
      return new Map()
    }
  }

  private resolveLocation(
    reference: ExternalLocationReference,
    locations: Map<number, LocationSchema>,
  ): LocationSchema {
    if (!reference.url) return this.unknownLocation(reference)

    const id = Number(new URL(reference.url).pathname.split('/').at(-1))
    return locations.get(id) ?? this.unknownLocation(reference)
  }

  private emptyPage(): CharacterSchemaPagination {
    return {
      info: {
        count: 0,
        pages: 0,
        next: null,
        prev: null,
      },
      results: [],
    }
  }

  async searchForCharacters({
    page,
    name,
    gender,
    status,
  }: QueryParamApiExternal): Promise<CharacterSchemaPagination> {
    try {
      const params = new URLSearchParams()

      if (page) params.append('page', page.toString())
      if (name) params.append('name', name)
      if (gender) params.append('gender', gender)
      if (status) params.append('status', status)

      const url: string = `${this.baseURL}/character?${params.toString()}`
      const cachedPage = this.getCachedPage(url)

      if (cachedPage) return cachedPage

      const responseCharacter = this.httpService
        .get<ExternalCharacterPage>(url)
        .pipe(map((res) => res.data))

      const characterData = await firstValueFrom(responseCharacter)
      const locations = await this.fetchLocations(characterData.results)

      const [next, prev] = [characterData.info.next, characterData.info.prev]

      const nextPage = next
        ? Number(new URL(next).searchParams.get('page'))
        : null
      const prevPage = prev
        ? Number(new URL(prev).searchParams.get('page'))
        : null

      const characters: CharacterSchema[] = characterData.results.map(
        (char) => ({
          id: char.id,
          name: char.name,
          status: char.status,
          species: char.species,
          type: char.type,
          gender: char.gender,
          origin: this.resolveLocation(char.origin, locations),
          location: this.resolveLocation(char.location, locations),
          image: char.image,
          created: char.created,
        }),
      )

      const filteredCharacterData: CharacterSchemaPagination = {
        info: {
          count: characterData.info.count,
          pages: characterData.info.pages,
          next: nextPage,
          prev: prevPage,
        },
        results: characters,
      }

      this.cachePage(url, filteredCharacterData)

      return filteredCharacterData
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return this.emptyPage()
      }

      throw new BadGatewayException(
        'O servico de personagens esta temporariamente indisponivel.',
      )
    }
  }

  async searchForCharacterById(id: number): Promise<CharacterSchema> {
    try {
      const responseCharacter = this.httpService
        .get(`${this.baseURL}/character/${id}`)
        .pipe(map((res) => res.data))
      const characterData = await firstValueFrom(responseCharacter)

      const location = await this.fetchLocation(characterData.location.url)
      const origin = await this.fetchLocation(characterData.origin.url)

      const filteredCharacterData: CharacterSchema = {
        id: characterData.id,
        name: characterData.name,
        status: characterData.status,
        species: characterData.species,
        type: characterData.type,
        gender: characterData.gender,
        origin,
        location,
        image: characterData.image,
        created: characterData.created,
      }

      return filteredCharacterData
    } catch (error) {
      throw new HttpException(
        'Personagem não encontrado.',
        HttpStatus.NOT_FOUND,
      )
    }
  }
}
