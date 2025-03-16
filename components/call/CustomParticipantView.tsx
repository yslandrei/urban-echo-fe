import { ParticipantView, useCallStateHooks } from '@stream-io/video-react-native-sdk'
import { View } from 'react-native'

const CustomParticipantView = () => {
  const { useParticipants } = useCallStateHooks()
  const participants = useParticipants()
  return <ParticipantView style={{ flex: 2, height: 0 }} participant={participants[0]} key={participants[0].userId} />
}

export default CustomParticipantView
