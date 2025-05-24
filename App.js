import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { TwilioVideoLocalView, TwilioVideoParticipantView, TwilioVideo } from 'react-native-twilio-video-webrtc';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [videoTracks, setVideoTracks] = useState(new Map());
  const twilioRef = useRef(null);

  // Hardcoded token for testing (replace with your generated token)
  const TWILIO_TOKEN = 'your_twilio_access_token'; // Replace with token from generateToken.js
  const ROOM_NAME = 'testRoom'; // Must match the room in the token

  // Request camera and microphone permissions
  const requestPermissions = async () => {
    const permissions = Platform.select({
      ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE],
      android: [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO],
    });

    for (const permission of permissions) {
      const result = await check(permission);
      if (result !== RESULTS.GRANTED) {
        await request(permission);
      }
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  // Connect to Twilio video room
  const handleConnect = () => {
    if (!TWILIO_TOKEN) {
      alert('Please set a valid Twilio token');
      return;
    }
    twilioRef.current.connect({ accessToken: TWILIO_TOKEN, roomName: ROOM_NAME });
    setIsConnected(true);
  };

  // Disconnect from Twilio video room
  const handleDisconnect = () => {
    twilioRef.current.disconnect();
    setIsConnected(false);
    setVideoTracks(new Map());
  };

  // Handle participant video track added
  const onParticipantAddedVideoTrack = ({ participant, track }) => {
    setVideoTracks((prev) => {
      const newMap = new Map(prev);
      newMap.set(track.trackSid, { participantSid: participant.sid, videoTrackSid: track.trackSid });
      return newMap;
    });
  };

  // Handle participant video track removed
  const onParticipantRemovedVideoTrack = ({ participant, track }) => {
    setVideoTracks((prev) => {
      const newMap = new Map(prev);
      newMap.delete(track.trackSid);
      return newMap;
    });
  };

  return (
    <View style={styles.container}>
      <TwilioVideo
        ref={twilioRef}
        onParticipantAddedVideoTrack={onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={onParticipantRemovedVideoTrack}
        onRoomDidConnect={() => console.log('Connected to room')}
        onRoomDidDisconnect={() => {
          console.log('Disconnected from room');
          setIsConnected(false);
        }}
        onRoomDidFailToConnect={(error) => {
          console.error('Failed to connect:', error);
          setIsConnected(false);
        }}
      />
      {!isConnected ? (
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Twilio Video Call</Text>
          <Button title="Join Room" onPress={handleConnect} />
        </View>
      ) : (
        <View style={styles.videoContainer}>
          <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
          {Array.from(videoTracks.entries()).map(([trackSid, track]) => (
            <TwilioVideoParticipantView
              key={trackSid}
              trackIdentifier={{ participantSid: track.participantSid, videoTrackSid: trackSid }}
              style={styles.remoteVideo}
            />
          ))}
          <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
            <Text style={styles.disconnectText}>Leave Room</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  localVideo: {
    width: 150,
    height: 200,
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 10,
    zIndex: 10,
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#000',
  },
  disconnectButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  disconnectText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;