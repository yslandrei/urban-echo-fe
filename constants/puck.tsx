import Svg, { Path, Circle, Ellipse } from 'react-native-svg'
import Colors from './Colors'

const puck = () => {
  return (
    <Svg height={40} width={40}>
      {' '}
      {/* Slightly larger SVG size */}
      {/* Outer circle with white border */}
      <Circle cx="20" cy="20" r="12" fill="white" />
      {/* Inner circle with primary color */}
      <Circle cx="20" cy="20" r="10" fill={Colors.primary} />
    </Svg>
  )
}

export default puck
