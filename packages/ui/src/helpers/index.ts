export const getInitials = (name: string) => {
  return name
    ?.split(" ")
    .splice(0, 2)
    .map((word) => word[0])
    .join("");
};

export const isS3Url = (url?: string) =>
  !url ? false : url.indexOf("eat-easer.s3.ap-south-1.amazonaws.com") !== -1;

/**
 * Accepts the time in HH:MM format and returns a Date object
 * @param timeString ex: 00:23
 * @returns Date
 */
export function getDateFromTimeString(timeString: string) {
  const today = new Date();
  const [hours, minutes] = timeString.split(":").map(Number);
  today.setHours(hours!);
  today.setMinutes(minutes!);

  return today;
}

export function getTimeFromDate(date: Date) {
  return date.toTimeString()?.split(" ")?.[0]?.substring(0, 5);
}

export const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return "Good Morning";
  if (currentHour < 18) return "Good Afternoon";
  return "Good Evening";
};
