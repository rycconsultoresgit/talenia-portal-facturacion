export const assignationColorToBar = (score: number): string => {
  if (score < 25) {
    return "bg-red-500";
  } else if (score >= 25 && score < 75) {
    return "bg-yellow-500";
  } else if (score >= 75) {
    return "bg-green-500";
  } else {
    return "bg-gray-500";
  }
};

export const assignationColorToBarTrack = (score: number): string => {
  if (score < 25) {
    return "bg-[#FFE3E3]";
  } else if (score >= 25 && score < 75) {
    return "bg-[#FFF4CF]";
  } else if (score >= 75) {
    return "bg-[#E6FFE3]";
  } else {
    return "bg-gray-500/20";
  }
};
