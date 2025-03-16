import { View, StyleSheet } from 'react-native'
import {
  CallControlsButton,
  HangUpCallButton,
  ToggleAudioPreviewButton,
  ToggleAudioPublishingButton,
} from '@stream-io/video-react-native-sdk'
import { BlindHangupCallButton } from './BlindHangupCallButton'

interface BlindCallControlsProps {
  onPress: () => void
}

export const BlindCallControls: React.FC<BlindCallControlsProps> = ({ onPress }) => {
  return (
    <View style={styles.buttonGroup}>
      <BlindHangupCallButton onPress={onPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 50,
  },
})
