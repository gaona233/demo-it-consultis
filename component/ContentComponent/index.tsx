import Image from "next/Image";
export interface PokemonInfo{
  name: string;
  url: string;
  id?: number;
}
interface PokemonCardProps {
  pokemons:PokemonInfo[];
}

export default function PokemonCard({ pokemons }: PokemonCardProps) {
  return (
    <section className="grid grid-cols-6 gap-16">
      {pokemons?.map((item) => (
        <div
          key={item.name + item.id}
          className="flex flex-col items-center justify-between"
        >
          <h3>{item.name}</h3>
          {item.url ? <img width="35" height="53" className="w-20" src={item?.url} alt={item.name}/> : <div className="w-35 h-53"></div> }
          <p>Number: {item.id}</p>
        </div>
      ))}
    </section>
  );
}
