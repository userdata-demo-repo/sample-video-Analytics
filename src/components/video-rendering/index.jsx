import React from 'react'
import videojs from "video.js";
import "video.js/dist/video-js.css";
// mock image listing json
import data from '../../assets/json/image-list.json';



async function createVideoFromJson(data, videoFileName) {
    const { createFFmpeg } = ffmpeg;
    const ffmpegInstance = createFFmpeg({
      log: true,
    });
  
    await ffmpegInstance.load();
  
    const imageList = JSON.parse(await (await fetch(data)).text());
  
    for (let i = 0; i < imageList.length; i++) {
      const imageInfo = imageList[i];
      const imageData = await (await fetch(imageInfo.url)).arrayBuffer();
      ffmpegInstance.FS("writeFile", `image${i}.jpg`, new Uint8Array(imageData));
    }
  
    const command = `-framerate 24 -i image%d.jpg -c:v libx264 -pix_fmt yuv420p ${videoFileName}`;
  
    await ffmpegInstance.run(...command.split(" "));
  
    const videoData = ffmpegInstance.FS("readFile", videoFileName);
  
    return new Blob([videoData.buffer], { type: "video/mp4" });
  }
  

function VideoPlayer() {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = videojs(videoRef.current);

    createVideoFromJson("data", "video.mp4")
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
      <video ref={data} className="video-js" />
    </div>
  );
}

export default VideoRender