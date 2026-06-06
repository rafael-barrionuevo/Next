import ReactPlayer from "react-player";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaMuteButton,
  MediaFullscreenButton,
  MediaCaptionsButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
} from "media-chrome/react";

import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { listarConteudos } from "../store/contentSlice";

function WatchContent() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const contents = useSelector(state => state.content.items);
  const status = useSelector(state => state.content.status);
  
  const [src, setSrc] = useState('');

  // Se for URL do Google Drive, converte para o proxy do backend
  const toProxiedUrl = (url) => {
    if (url?.includes('drive.google.com')) {
      return `http://localhost:3000/proxy/video?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  useEffect(() => {
    if (contents.length === 0 && status === 'idle') {
      dispatch(listarConteudos());
    } else {
      let foundUrl = '';
      for (const content of contents) {
        if (content.tipo_midia === 'filme' && content._id === id) {
          foundUrl = content.filme?.url_filme;
          break;
        } else if (content.tipo_midia === 'serie' && content.temporadas) {
          for (const temporada of content.temporadas) {
            const ep = temporada.episodios?.find(e => e._id === id);
            if (ep) {
              foundUrl = ep.url_ep;
              break;
            }
          }
          if (foundUrl) break;
        }
      }

      const finalUrl = foundUrl || 'https://www.youtube.com/watch?v=C5tn1MvXsLw';
      setSrc(toProxiedUrl(finalUrl));
    }
  }, [id, contents, status, dispatch]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black font-sans">
      
      <MediaController 
        className="group relative h-full w-full"
        style={{
          "--media-primary-color": "#ffffff",
          "--media-secondary-color": "rgba(255, 255, 255, 0.7)",
          "--media-range-track-background": "rgba(255, 255, 255, 0.3)",
          "--media-range-bar-color": "#B30FAB", 
          "--media-range-thumb-background": "#F32DAE",
          "--media-control-background": "transparent",
          "--media-control-hover-background": "rgba(255, 255, 255, 0.1)",
        }}
      >
        <ReactPlayer
          slot="media"
          src={src}
          width="100%"
          height="100%"
          controls={false}
          playing={true}
          config={{
            youtube: {
              playerVars: { modestbranding: 1, showinfo: 0, rel: 0 }
            }
          }}
        />

        {/* Botão Sair - canto superior esquerdo */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 w-full bg-gradient-to-b from-black/80 to-transparent px-6 pb-16 pt-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={() => navigate(-1)}
            className="pointer-events-auto flex items-center gap-2 text-white transition-colors hover:text-white/80"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <MediaControlBar 
          className="absolute bottom-0 flex w-full items-center bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pb-4 pt-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <MediaPlayButton className="mr-2" />
          <MediaSeekBackwardButton seekOffset={10} className="mr-1" />
          <MediaSeekForwardButton seekOffset={10} className="mr-2" />
          
          <MediaTimeRange className="flex-grow mx-3" />
          
          <MediaTimeDisplay className="text-sm font-medium mr-4" />
          <MediaMuteButton />
          <MediaVolumeRange className="w-24 mr-2" />
          <MediaCaptionsButton className="mr-2" />
          <MediaPlaybackRateButton className="mr-2" />
          <MediaFullscreenButton />
        </MediaControlBar>

      </MediaController>
    </div>
  );
}

export default WatchContent;