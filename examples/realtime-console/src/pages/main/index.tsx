import React, { useState, useRef, useCallback } from 'react';
import { message } from 'antd';
import {
  RealtimeClient,
  RealtimeAPIError,
  EventNames,
} from '@coze/realtime-api';
import { isShowVideo } from '../../utils/utils';
import { LocalManager, LocalStorageKey } from '../../utils/local-manager';
import './styles.css';

// 导入图片资源
import avatarImage from '../../assets/avatar2.png';
import microphoneIcon from '../../assets/microphone.png';
import muteIcon from '../../assets/mute.png';
import telephoneIcon from '../../assets/telephone.png';
import hangupIcon from '../../assets/hangup.png';

// 配置信息
const CONFIG = {
  accessToken: 'pat_Pcvuj7NOFT4EfHSJMjqZYDOmbB6TxFSSsr1BHqrUCI7inqWbIxz7vYrRnJEcjpex',
  botId: '7447765883952398386',
  //voiceId: '7426720361732915209', //湾区大叔
  //voiceId: '7426720361732964361', //北京小爷
  //voiceId: '7426720361733177353', //渊博小叔
  //voiceId: '7426725529589645339', //解说小明
  //voiceId: '7426725529589628955', //东方浩然
  //voiceId: '7426725529589596187', //甜美女声
  //voiceId: '7426725529589661723', //开朗姐姐
  //voiceId: '7426725529589694491', //甜美悦悦
  //voiceId: '7426720361732931593', //甜美悦悦
  voiceId: '7426725529589596187', //湾区大叔
  baseUrl: 'https://api.coze.cn'
};

const RealtimeConsole: React.FC = () => {
  const clientRef = useRef<RealtimeClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const localManager = new LocalManager();

  const handleInitClient = () => {
    if (clientRef.current) {
      return;
    }

    const client = new RealtimeClient({
      accessToken: CONFIG.accessToken,
      botId: CONFIG.botId,
      voiceId: CONFIG.voiceId,
      debug: true,
      baseURL: CONFIG.baseUrl,
      allowPersonalAccessTokenInBrowser: true,
      audioMutedDefault: !isMicrophoneOn,
      suppressStationaryNoise: true,
      suppressNonStationaryNoise: true,
      connectorId: '1024',
      videoConfig: isShowVideo()
        ? {
            renderDom: 'local-player',
            videoOnDefault:
              localManager.get(LocalStorageKey.VIDEO_STATE) === 'true',
          }
        : undefined,
    });

    client.on(EventNames.ALL, handleAllMessage);
    clientRef.current = client;
  };

  const handleConnect = async () => {
    if (!window.RTCPeerConnection) {
      message.error('您的浏览器不支持WebRTC，请使用现代浏览器。');
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        message.error('您的浏览器不支持音频输入，请使用现代浏览器。');
        return;
      }

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        message.info('请允许麦克风访问权限');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      stream.getTracks().forEach(track => track.stop());

    } catch (err: unknown) {
      console.error('麦克风访问错误:', err);
      if (err instanceof Error) {
        switch (err.name) {
          case 'NotAllowedError':
          case 'PermissionDeniedError':
            message.error('麦克风访问被拒绝，请在浏览器设置中允许访问。');
            break;
          case 'NotFoundError':
            message.error('未找到麦克风设备，请确保设备已连接。');
            break;
          case 'NotReadableError':
          case 'TrackStartError':
            message.error('无法启动麦克风，请确保没有其他应用正在使用它。');
            break;
          default:
            message.error('访问麦克风失败，请检查设备设置。');
        }
      } else {
        message.error('访问麦克风失败，请检查设备设置。');
      }
      return;
    }

    handleInitClient();

    if (!clientRef.current) {
      return;
    }

    try {
      await clientRef.current.connect();
      setIsConnected(true);
      message.success('已连接，请开始对话。');
    } catch (e: unknown) {
      if (e instanceof RealtimeAPIError) {
        message.error(`连接失败: ${e.message}`);
      } else if (e instanceof Error) {
        message.error(`发生错误: ${e.message}`);
      } else {
        message.error('发生未知错误');
      }
      console.log('连接错误', e);
    }
  };

  const handleDisconnect = async () => {
    if (!clientRef.current || !clientRef.current.isConnected) {
      return;
    }

    try {
      await clientRef.current.disconnect();
      clientRef.current.off(EventNames.ALL, handleAllMessage);
      clientRef.current = null;
      setIsConnected(false);
      message.success('已断开连接');
    } catch (e) {
      if (e instanceof RealtimeAPIError) {
        message.error(`断开连接失败: ${e.message}`);
      } else {
        message.error('断开连接失败');
      }
      console.error(e);
    }
  };

  const handleAllMessage = useCallback((eventName: string, data: unknown) => {
    console.log('event', eventName, data);
  }, []);

  const toggleMicrophone = () => {
    setIsMicrophoneOn(!isMicrophoneOn);
    if (clientRef.current) {
      clientRef.current.setAudioEnable(!isMicrophoneOn);
    }
  };

  // 添加白点组件
  // const Dots = () => (
  //   <>
  //     <div className="dot dot-1" />
  //     <div className="dot dot-2" />
  //     <div className="dot dot-3" />
  //     <div className="dot dot-4" />
  //   </>
  // );

  // 添加连接中的动画点
  const ConnectingDots = () => (
    <div className="connecting-dots">
      <div className="connecting-dot" />
      <div className="connecting-dot" />
      <div className="connecting-dot" />
    </div>
  );

  return (
    <div className="call-container">
      <header className="header">
        <span className="title">心生命</span>
        <button className="subtitle-button">文字对话</button>
      </header>

      <div className="avatar-container">
        <div className={`avatar ${isConnected ? 'avatar-connected' : 'avatar-waiting'}`}>
          <img src={avatarImage} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
        </div>
      </div>

      <div className="controls">
        <div className="buttons-container">
          {isConnected ? (
            <>
              <button 
                className="control-button mic-button"
                onClick={toggleMicrophone}
              >
                <img 
                  src={isMicrophoneOn ? microphoneIcon : muteIcon}
                  alt="Microphone" 
                  style={{ opacity: isMicrophoneOn ? 1 : 0.5 }} 
                />
              </button>
              <ConnectingDots />
              <button 
                className="control-button hangup-button"
                onClick={handleDisconnect}
              >
                <img src={hangupIcon} alt="Hang up" />
              </button>
            </>
          ) : (
            <button 
              className="control-button call-button"
              onClick={handleConnect}
            >
              <img src={telephoneIcon} alt="Call" />
            </button>
          )}
        </div>
        <p className="status-text">
          {isConnected ? '正在通话中...' : '点我语音对话'}
        </p>
      </div>
    </div>
  );
};

export default RealtimeConsole;
