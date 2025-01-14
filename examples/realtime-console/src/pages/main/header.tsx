import React from 'react';
import { Button } from 'antd';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';

interface HeaderProps {
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onToggleMicrophone: (isMicrophoneOn: boolean) => void;
  isMicrophoneOn: boolean;
  isConnected?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onConnect,
  onDisconnect,
  onToggleMicrophone,
  isMicrophoneOn,
  isConnected,
}) => {
  return (
    <div>
      <Button
        type="primary"
        onClick={isConnected ? onDisconnect : onConnect}
        className={isConnected ? 'button-danger' : 'button-connect'}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </Button>
      <Button
        type="primary"
        onClick={() => onToggleMicrophone(!isMicrophoneOn)}
        disabled={!isConnected}
        icon={isMicrophoneOn ? <AudioOutlined /> : <AudioMutedOutlined />}
      >
        {isMicrophoneOn ? 'Mute' : 'Unmute'}
      </Button>
    </div>
  );
};

export default Header;
