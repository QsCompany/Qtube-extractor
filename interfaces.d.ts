export interface IVideoInfo {
  relative_loudness: number;
  hl: string;
  vss_host: string;
  innertube_context_client_version: number;
  url_encoded_fmt_stream_map: string;
  host_language: string;
  fade_out_start_milliseconds: number;
  ad3_module: number;
  itct: string;
  watermark: string;
  innertube_api_key: string;
  rvs: string;
  midroll_prefetch_size: number;
  ismb: number;
  status: string;
  root_ve_type: number;
  apiary_host_firstparty: string;
  tag_for_child_directed: string;
  timestamp: number;
  iv_load_policy: number;
  title: string;
  player_response: Playerresponse;
  innertube_api_version: string;
  ssl: number;
  iurlsd: string;
  adaptive_fmts: string;
  iurlhq: string;
  external_play_video: number;
  tmi: number;
  gapi_hint_params: string;
  author: string;
  subscribed: string;
  fade_out_duration_milliseconds: number;
  csn: string;
  fflags: string;
  ldpj: number;
  iurlmaxres: string;
  video_id: string;
  allow_html5_ads: number;
  player_error_log_fraction: number;
  csi_page_type: string;
  ucid: string;
  serialized_ad_ux_config?: ((string[] | number)[][] | null)[][];
  profile_picture: string;
  iv_invideo_url: string;
  cver: number;
  fade_in_duration_milliseconds: number;
  no_get_video_log: number;
  channel_path: string;
  cr: string;
  fade_in_start_milliseconds: number;
  vmap: string;
  enablecsi: number;
  apiary_host: string;
  account_playback_token: string;
  ad_device: number;
  sffb: string;
  enabled_engage_types: string;
  thumbnail_url: string;
  midroll_freqcap: number;
  expanded_title: string;
  xhr_apiary_host: string;
  t: number;
  iurlmq: string;
  token: number;
  apply_fade_on_midrolls: string;
  loudness: number;
  fmt_list: string;
  expanded_subtitle: string;
  c: string;
  iv3_module: number;
  iurl: string;
  iv_allow_in_place_switch: number;
  subtitle: string;
  length_seconds: number;
  fexp: string;
  idpj: number;
}

interface Playerresponse {
  playabilityStatus: PlayabilityStatus;
  streamingData: StreamingData;
  playbackTracking: PlaybackTracking;
  captions: Captions;
  videoDetails: VideoDetails;
  playerConfig: PlayerConfig;
  storyboards: Storyboards;
  attestation: Attestation;
  endscreen: Endscreen;
  adSafetyReason: AdSafetyReason;
}

interface AdSafetyReason {
  isEmbed: boolean;
  isRemarketingEnabled: boolean;
  isFocEnabled: boolean;
}

interface Endscreen {
  endscreenUrlRenderer: UrlEndpoint;
}

interface Attestation {
  playerAttestationRenderer: PlayerAttestationRenderer;
}

interface PlayerAttestationRenderer {
  challenge: string;
}

interface Storyboards {
  playerStoryboardSpecRenderer: PlayerStoryboardSpecRenderer;
}

interface PlayerStoryboardSpecRenderer {
  spec: string;
}

interface PlayerConfig {
  audioConfig: AudioConfig;
  streamSelectionConfig: StreamSelectionConfig;
}

interface StreamSelectionConfig {
  maxBitrate: string;
}

interface AudioConfig {
  loudnessDb: number;
  perceptualLoudnessDb: number;
}

interface VideoDetails {
  videoId: string;
  title: string;
  lengthSeconds: string;
  keywords: string[];
  channelId: string;
  isOwnerViewing: boolean;
  shortDescription: string;
  isCrawlable: boolean;
  thumbnail: Thumbnail2;
  averageRating: number;
  allowRatings: boolean;
  viewCount: string;
  author: string;
  isPrivate: boolean;
  isUnpluggedCorpus: boolean;
  isLiveContent: boolean;
}

interface Thumbnail2 {
  thumbnails: Thumbnail[];
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface Captions {
  playerCaptionsTracklistRenderer: PlayerCaptionsTracklistRenderer;
}

interface PlayerCaptionsTracklistRenderer {
  captionTracks: CaptionTrack[];
  audioTracks: AudioTrack[];
  translationLanguages: TranslationLanguage[];
  defaultAudioTrackIndex: number;
  contribute: Contribute;
}

interface Contribute {
  captionsMetadataRenderer: CaptionsMetadataRenderer;
}

interface CaptionsMetadataRenderer {
  addSubtitlesText: AddSubtitlesText;
  noSubtitlesText: Name;
  promoSubtitlesText: Name;
}

interface AddSubtitlesText {
  runs: Run2[];
}

interface Run2 {
  text: string;
  navigationEndpoint: NavigationEndpoint;
}

interface NavigationEndpoint {
  clickTrackingParams: string;
  urlEndpoint: UrlEndpoint;
}

interface UrlEndpoint {
  url: string;
}

interface TranslationLanguage {
  languageCode: string;
  languageName: Name;
}

interface AudioTrack {
  captionTrackIndices: number[];
  defaultCaptionTrackIndex: number;
  visibility: string;
  hasDefaultTrack: boolean;
}

interface CaptionTrack {
  baseUrl: string;
  name: Name;
  vssId: string;
  languageCode: string;
  rtl?: boolean;
  isTranslatable: boolean;
  kind?: string;
}

interface Name {
  runs: Run[];
}

interface Run {
  text: string;
}

interface PlaybackTracking {
  videostatsPlaybackUrl: VideostatsPlaybackUrl;
  videostatsDelayplayUrl: VideostatsPlaybackUrl;
  videostatsWatchtimeUrl: VideostatsPlaybackUrl;
  ptrackingUrl: VideostatsPlaybackUrl;
  qoeUrl: VideostatsPlaybackUrl;
  setAwesomeUrl: SetAwesomeUrl;
  atrUrl: SetAwesomeUrl;
  youtubeRemarketingUrl: SetAwesomeUrl;
}

interface SetAwesomeUrl {
  baseUrl: string;
  elapsedMediaTimeSeconds: number;
}

interface VideostatsPlaybackUrl {
  baseUrl: string;
}

interface StreamingData {
  expiresInSeconds: string;
  formats: Format[];
  adaptiveFormats: AdaptiveFormat[];
  probeUrl: string;
}

interface AdaptiveFormat {
  itag: number;
  url: string;
  mimeType: string;
  bitrate: number;
  width?: number;
  height?: number;
  initRange: InitRange;
  indexRange: InitRange;
  lastModified: string;
  contentLength: string;
  quality: string;
  fps?: number;
  qualityLabel?: string;
  projectionType: string;
  averageBitrate: number;
  approxDurationMs: string;
  colorInfo?: ColorInfo;
  highReplication?: boolean;
  audioQuality?: string;
  audioSampleRate?: string;
}

interface ColorInfo {
  primaries: string;
  transferCharacteristics: string;
  matrixCoefficients: string;
}

interface InitRange {
  start: string;
  end: string;
}

interface Format {
  itag: number;
  url: string;
  mimeType: string;
  bitrate: number;
  width: number;
  height: number;
  lastModified: string;
  contentLength?: string;
  quality: string;
  qualityLabel: string;
  projectionType: string;
  averageBitrate?: number;
  audioQuality: string;
  approxDurationMs?: string;
  audioSampleRate?: string;
}

interface PlayabilityStatus {
  status: string;
  playableInEmbed: boolean;
}
declare type videoId = string | number | boolean;
declare type tabId = string | null | number;
declare type winId = string | number;

interface tab {
  videoId: videoId;
  ids: {}
}

interface tabs {
  [id: string]: tab
}
interface Win {
  activeTab: tabId;
  tabs: tabs;
}
interface Wins {
  [id: string]: Win;
}

interface globals {
  track: Wins;
  activeWindow: winId;
  currentVid?: videoId;
  ids: {};
  create(winId: winId, tabId: tabId): tab;
  active: { win: winId, tab: tabId, vid: videoId, ids: {} },
  cache: Map<videoId, IVideoInfo>
  selectedTab: tab;
}

declare function getVideoInfo(video_id: string, callback: (err: boolean, data: IVideoInfo) => void): void;


interface IPlayListResultItems {
  kind: string;
  etag: string;
  pageInfo: PageInfo;
  items: Item[];
}

interface Item {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
  contentDetails: ContentDetails;
}

interface ContentDetails {
  videoId: string;
  videoPublishedAt?: string;
}

interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails?: Thumbnails;
  channelTitle: string;
  playlistId: string;
  position: number;
  resourceId: ResourceId;
}

interface ResourceId {
  kind: string;
  videoId: string;
}

interface Thumbnails {
  default: Thumbnail;
  medium: Thumbnail;
  high: Thumbnail;
  standard: Thumbnail;
  maxres: Thumbnail;
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}