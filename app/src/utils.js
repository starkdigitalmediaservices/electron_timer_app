export function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const paddedSeconds = String(seconds % 60).padStart(2, '0');
  const paddedMinutes = String(minutes % 60).padStart(2, '0');
  const paddedHours = String(hours).padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

