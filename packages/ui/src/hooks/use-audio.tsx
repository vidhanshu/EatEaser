import { useRef } from "react";

export const useAudio = ({ src }: { src: any }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const elm = (
    <>
      <audio ref={audioRef} className="hidden" controls src={src} />
      <button
        onClick={() => audioRef?.current?.play()}
        className="hidden"
        ref={btnRef}
      />
    </>
  );

  const onPlayMusic = () => btnRef.current?.click();

  return {
    onPlayMusic,
    // this can be placed anywhere in the page to play the audio
    elm,
  };
};
