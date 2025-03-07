import { View, StyleSheet } from 'react-native'
import { CustomHangupCallButton } from './CustomHangupCallButton'

interface CustomCallControlsProps {
  onPress: () => void
}

export const CustomCallControls: React.FC<CustomCallControlsProps> = ({ onPress }) => {
  return (
    <View style={styles.buttonGroup}>
      <CustomHangupCallButton onPress={onPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
})
