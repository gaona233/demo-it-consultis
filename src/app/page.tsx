"use client";

import { fetchPokemonList, fetchPokemonTypes, LIMT } from "@/utils/api";
import { useProgressiveFetch } from "@/utils/batchApi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ContentComponent, {
  PokemonInfo,
} from "../../component/ContentComponent/index";
import TypeComponent from "../../component/TypeComponent/index";

export default function Home() {
  const [types, updateTypes] = useState<string[]>([]);
  const [selectedTypes, updateSelectedTypes] = useState<string[]>([]);
  const [pokemoInfo, updatePokemoInfo] = useState<PokemonInfo[]>([]);
  const [searchInfo, updateSearch] = useState({
    total: 0,
    page: 0,
  });
  const [imgApis, updateImgApis] = useState([]);
  const pokeMonInfoMap = useRef(new Map());

  useEffect(() => {
    fetchPokemonTypes().then((data) => {
      if (data?.results) {
        updateTypes(
          data.results?.map((item: { name: string; url: string }) => item.name)
        );
      }
    });
  }, []);

  useEffect(() => {
    getPokemoInfo();
  }, [searchInfo.page]);

  const getPokemoInfo = useCallback(async () => {
    if (selectedTypes.length == 0) {
      const data = await fetchPokemonList(searchInfo.page);
      console.log(data);
      const source = data?.results || [];
      updateImgApis(source?.map((item: PokemonInfo) => item.url));
      updatePokemoInfo(
        source?.map((item: PokemonInfo) => ({
          ...item,
          url: "",
          id: item.url.match(/pokemon\/(\d+)/)?.[1],
        }))
      );
      updateSearch({
        ...searchInfo,
        total: data.count,
      });
    }
  }, [selectedTypes, searchInfo]);

  const clickType = useCallback(
    (type: string) => {
      let newData = [...selectedTypes];
      const index = newData.indexOf(type);
      if (index > -1) {
        newData.splice(index, 1);
      } else {
        newData.push(type);
      }
      updateSelectedTypes(newData);
    },
    [types, selectedTypes]
  );

  const { items } = useProgressiveFetch(imgApis, { concurrentLimit: 5 });

  useEffect(() => {
    items.forEach((res: any) => {
      pokeMonInfoMap.current.set(res.name, {
        name: res.name,
        url: res?.sprites.other?.showdown?.front_default,
        id: res?.id,
      });
    });
  }, [items]);

  const showPokemonInfo = useMemo(() => {
    return pokemoInfo.map((item) => {
      if (pokeMonInfoMap.current.has(item.name)) {
        return { ...pokeMonInfoMap.current.get(item.name) };
      }
      return {
        ...item,
      };
    });
  }, [pokeMonInfoMap.current.size, pokemoInfo]);

  const isShowNext = useMemo(() => {
    return searchInfo.total / LIMT > searchInfo.page
  } ,[searchInfo.page ,searchInfo.total])

  return (
    <div className="flex flex-col gap-4 px-10">
      <p className="text-center">Welcome to Pokemon world</p>
      <p>Total count: {}</p>
      <TypeComponent
        types={types}
        selectedTypes={selectedTypes}
        clickType={clickType}
      />
      <section className="flex flex-col justify-center">
        <ContentComponent pokemons={showPokemonInfo} />
        <div className="flex justify-center gap-4 py-4">
          {searchInfo.page !== 0 && (
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white"
              onClick={() => {
                updateSearch({
                  ...searchInfo,
                  page: searchInfo.page - 1,
                });
              }}
            >
              Previous
            </button>
          )}
          { isShowNext && (
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white"
              onClick={() => {
                updateSearch({
                  ...searchInfo,
                  page: searchInfo.page + 1,
                });
              }}
            >
              Next
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
