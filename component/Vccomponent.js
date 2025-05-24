import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import TwilioVideo from 'react-native-twilio-video-webrtc';
import generateToken from '../utils/generateToken'; // Adjust the path as per your file structure

export default function VideoCallScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const twilioRef = useRef(null);

  const connectToRoom = () => {
    const token = generateToken('test-user'); // Generate a token with a unique identity
    twilioRef.current.connect({ roomName: 'test-room', accessToken: token });
    setIsConnected(true);
  };

  const disconnectFromRoom = () => {
    twilioRef.current.disconnect();
    setIsConnected(false);
  };

  return (
    <View style={styles.container}>
      {isConnected ? (
        <View style={styles.videoContainer}>
          <TwilioVideo
            ref={twilioRef}
            onRoomDidConnect={() => console.log('Connected to room')}
            onRoomDidDisconnect={() => console.log('Disconnected from room')}
            onParticipantAddedVideoTrack={(participant, track) =>
              console.log('Participant added video track', participant, track)
            }
            onParticipantRemovedVideoTrack={(participant, track) =>
              console.log('Participant removed video track', participant, track)
            }
          />
        </View>
      ) : (
        <Button title="Join Call" onPress={connectToRoom} />
      )}
      {isConnected && <Button title="Leave Call" onPress={disconnectFromRoom} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
