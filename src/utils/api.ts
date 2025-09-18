import axios from 'axios';

const api = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/',
})
export const LIMT = 24

export const fetchPokemonList = async (page:number) => {
    const response = await api.get(`/pokemon?limit=${LIMT}&offset=${page*LIMT}`)
    return response.data
}

export const fetchPokemonDetails = async (id: string) => {
    const response = await api.get(`pokemon/${id}`)
    return response.data
}

export const fetchPokemonTypes = async () => {
    const response = await api.get(`/type`)
    return response.data
}