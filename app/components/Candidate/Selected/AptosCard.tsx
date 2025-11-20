import { IconType } from "react-icons";

interface AptosCardProps {
  title: string;
  count: number;
  icon: IconType;
  bgColor?: string;
  totalCandidates: number;
}

export function AptosCard({
  title,
  count,
  bgColor,
  icon: Icon,
  totalCandidates,
}: Readonly<AptosCardProps>) {
  // Calcular el porcentaje de aptos
  const percentage = totalCandidates > 0 ? (count / totalCandidates) * 100 : 0;
  // Calcular la altura de la barra basada en el porcentaje
  // Usamos un mínimo del 20% de la altura máxima para mejor visibilidad
  const minHeightPercentage = 20;
  const effectivePercentage = Math.max(percentage, minHeightPercentage);
  const barHeight = (effectivePercentage / 100) * 5;
  return (
    <div className="flex h-full flex-row items-end gap-5">
      <div
        className={`w-3 rounded-sm ${bgColor} transition-all duration-300 ease-in-out`}
        style={{
          height: `${barHeight}rem`,
        }}
        title={`${percentage.toFixed(1)}% de aptitud`}
      />

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-medium text-purple">{title}</h3>

        <div className="flex items-center gap-1">
          <Icon className="h-[18px] w-[18px] text-purple" />
          <p className="text-sm font-medium text-lightGray">
            {count} candidatos
          </p>
        </div>
      </div>
    </div>
  );
}
