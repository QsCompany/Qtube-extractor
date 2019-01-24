import { Format } from "./interfaces";

interface VideoUrl extends Format {
}

interface Video {
    id: string;
    title: string;
    description: string;
    playlistId: string;
    position: string;
    channelId: string;
    channelTitle: string;
    urls: VideoUrl[];
}

interface page {
    items: _Videoinfo[];
}


interface _VideoUrls {
    quality: string[];
    itag: string[];
    type: string;
    url: string[];
}

interface _Videoinfo {
    channelId: string;
    channelTitle: string;
    playlistId: string;
    description: string;
    position: string;
    status: "ok" | 'deny';
    thumbnail_url: string;
    timestamp: number;
    title: string;
    url_encoded_fmt_stream_map: string;
    video_id: string;
    urls: _VideoUrls;
}
