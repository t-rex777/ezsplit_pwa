export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    if (diffInDays === 1) return "Added yesterday";
    if (diffInDays < 7) return `Added ${diffInDays} days ago`;
    if (diffInDays < 30) return `Added ${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365)
      return `Added ${Math.floor(diffInDays / 30)} months ago`;
    return `Added ${Math.floor(diffInDays / 365)} years ago`;
  }
  if (diffInHours > 0) {
    if (diffInHours === 1) return "Added 1 hour ago";
    return `Added ${diffInHours} hours ago`;
  }
  if (diffInMinutes > 0) {
    if (diffInMinutes === 1) return "Added 1 minute ago";
    return `Added ${diffInMinutes} minutes ago`;
  }
  return "Added just now";
};
