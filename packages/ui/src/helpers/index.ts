export const getInitials = (name: string) => {
  return name
    ?.split(" ")
    .splice(0, 2)
    .map((word) => word[0])
    .join("");
};
