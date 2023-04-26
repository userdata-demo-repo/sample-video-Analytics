import React from 'react'
import videojs from "video.js";
import "video.js/dist/video-js.css";

function VideoPlayer() {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = videojs(videoRef.current);

    createVideoFromJson("imageData.json", "video.mp4")
      .then((blob) => {
        player.src(URL.createObjectURL(blob));
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      player.dispose();
    };
  }, []);
  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js" />
    </div>
  );
}

export default index