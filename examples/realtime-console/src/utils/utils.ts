export const isShowVideo = () => {
  const enableVideo = localStorage.getItem('video_state');
  return enableVideo === 'true' && `${process.env.REACT_APP_ENABLE_VIDEO}` === 'true';
};
