import { screenCanvs } from "./graphics";
let triedFullscreen = false;

export const openFullscreen = () => {
  if (triedFullscreen) {
    return;
  }
  triedFullscreen = true;
  if (!confirm("Switch to fullscreen for a better touch experience?")) {
    return;
  }

  try {
    if (screen?.orientation?.lock) {
      window.screen.orientation.lock("portrait").catch(() => {});
    }
  } catch {}

  try {
    document.body.requestFullscreen();
    // screenCanvs
    //   .requestFullscreen()
    //   .catch(() => {})
    //   .finally(() => {});
  } catch {}

  //   if (screenCanvs.requestFullscreen) {
  //     screenCanvs.requestFullscreen();
  //     // @ts-ignore
  //   } else if (screenCanvs.mozRequestFullScreen) {
  //     /* Firefox */
  //     // @ts-ignore
  //     screenCanvs.mozRequestFullScreen();
  //     // @ts-ignore
  //   } else if (screenCanvs.webkitRequestFullscreen) {
  //     /* Chrome, Safari & Opera */
  //     // @ts-ignore
  //     screenCanvs.webkitRequestFullscreen();
  //     // @ts-ignore
  //   } else if (screenCanvs.msRequestFullscreen) {
  //     /* IE/Edge */
  //     // @ts-ignore
  //     screenCanvs.msRequestFullscreen();
  //   }
};

export const setCursor = (c = "") => {
  screenCanvs.className = c;
};
