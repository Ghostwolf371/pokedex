import { pokemonTypeColors } from "../utils";

interface TypeCardProps {
  type: string;
}

const TypeCard = ({ type }: TypeCardProps) => {
  return (
    <div
      className="type-tile"
      style={{
        color: pokemonTypeColors?.[type]?.color,
        background: pokemonTypeColors?.[type]?.background,
      }}
    >
      <p>{type}</p>
    </div>
  );
};
export default TypeCard;
