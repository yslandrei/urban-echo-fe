import { View, StyleSheet } from 'react-native'
import {
  CallControlsButton,
  HangUpCallButton,
  ToggleAudioPreviewButton,
  ToggleAudioPublishingButton,
} from '@stream-io/video-react-native-sdk'

interface VolunteerCallControlsProps {
  onPress: () => void
}

export const VolunteerCallControls: React.FC<VolunteerCallControlsProps> = ({ onPress }) => {
  return (
    <View style={styles.buttonGroup}>
      <ToggleAudioPreviewButton />
      <HangUpCallButton size={60} onPressHandler={onPress} />
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
