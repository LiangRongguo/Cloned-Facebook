export const convertUnixTime = (unix_time) => {
  const currentTime = new Date();

  const date = new Date(parseInt(unix_time));

  const sec_diff = (currentTime.getTime() - date.getTime()) / 1000;
  const day_diff = Math.floor(sec_diff / 86400);

  return (day_diff === 0 && (
    (sec_diff < 60 && "Just now") ||
    (sec_diff < 120 && "1m") ||
    (sec_diff < 3600 && Math.floor(sec_diff / 60) + "m") ||
    (sec_diff < 7200 && "1h") ||
    (sec_diff < 86400 && Math.floor(sec_diff / 3600) + "h"))) ||
    (day_diff === 1 && "Yesterday") ||
    (day_diff < 7 && day_diff + "d") ||
    (day_diff < 31 && Math.ceil(day_diff / 7) + "w") || date.toLocaleTimeString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
};

export const convertUnixTimeToFullDate = (unix_time) => {
  var date = new Date(parseInt(unix_time));
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleTimeString("en-US", options);
};

export const convertPublicityToIconAndTooltip = (publicity) => {
  switch (publicity) {
    case "public":
      return {
        icon: <><i class="fas fa-globe-americas"></i></>,
        tooltip: "Everyone can see this post."
      }

    case "friends":
      return {
        icon: <><i class="fas fa-user-friends"></i></>,
        tooltip: "Only friends can see this post."
      }

    case "mentioned":
      return {
        icon: <><i class="fas fa-at"></i></>,
        tooltip: "Only people mentioned can see this"
      }

    case "private":
      return {
        icon: <><i class="fas fa-lock"></i></>,
        tooltip: "Only you can see this post."
      }

    default:
      return {
        icon: <><i class="fas fa-globe-americas"></i></>,
        tooltip: "Everyone can see this post."
      }
  }
}