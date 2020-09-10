import React, { useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import useAgora from './hooks/useAgora';
import MediaPlayer from './components/MediaPlayer';
import './Call.css';

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });

function Call() {
  const [ appid, setAppid ] = useState('');
  const [ token, setToken ] = useState('');
  const [ channel, setChannel ] = useState('');
  const [ uid, setUid ] = useState();
  const {
    localAudioTrack, localVideoTrack, leave, join, joinState, remoteUsers
  } = useAgora(client);

  const injectedStream = remoteUsers.find(stream => stream.uid === "666")
  console.log(remoteUsers);

  return (
    <div className='call'>
      <form className='call-form'>
        <label>
          AppID:
          <input type='text' name='appid' onChange={(event) => { setAppid(event.target.value) }}/>
        </label>
        <label>
          Token(Optional):
          <input type='text' name='token' onChange={(event) => { setToken(event.target.value) }} />
        </label>
        <label>
          Channel:
          <input type='text' name='channel' onChange={(event) => { setChannel(event.target.value) }} />
        </label>
        <label>
          UID:
          <input type='text' name='channel' onChange={(event) => { setUid(event.target.value) }} />
        </label>
        <div className='button-group'>
          <button id='join' type='button' className='btn btn-primary btn-sm' disabled={joinState} onClick={() => {join(appid, channel, token, uid)}}>Join</button>
          <button id='leave' type='button' className='btn btn-primary btn-sm' disabled={!joinState} onClick={() => {leave()}}>Leave</button>
        </div>
      </form>
      <div className='player-container'>
        <div className='main-player'>
          {injectedStream ? (
            <div className='remote-player-wrapper' key={injectedStream.uid}>
              <p className='remote-player-text'>Main Video</p>
              <MediaPlayer videoTrack={injectedStream.videoTrack} audioTrack={injectedStream.audioTrack}></MediaPlayer>
            </div>
          ) : (
            <div className='preview-screen'>
              <p className='preview-text'>Class waiting to start</p>
            </div>
          )
        
        }
        </div>
        <div className='local-player-wrapper'>
          <div>
            <p className='local-player-text'>{localVideoTrack && `localTrack`}{joinState && localVideoTrack ? `(${client.uid})` : ''}</p>
            <MediaPlayer videoTrack={localVideoTrack}></MediaPlayer>
          </div>
          {remoteUsers.map(user => {if (user.uid !== '666') return (<div className='remote-player-wrapper' key={user.uid}>
            <p className='remote-player-text'>{`remoteVideo(${user.uid})`}</p>
            <MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
          </div>)})}
        </div>
      </div>
    </div>
  );
}

export default Call;
