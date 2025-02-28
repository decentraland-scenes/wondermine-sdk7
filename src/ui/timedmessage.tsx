import { type Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label } from '@dcl/sdk/react-ecs'
import Canvas from './canvas/Canvas'

type TimedMessageProps = {
  visible: boolean
  color: Color4
  text: string
}

function TimedMessage({
  visible,
  text,
  color
}: TimedMessageProps): ReactEcs.JSX.Element {
  return (
    <Canvas>
      <Label
        uiTransform={{
          width: '100%',
          height: '100%',
          position: {bottom:'10%'}
        }}
        fontSize={20} 
        font="sans-serif"
        value={text} 
        color={color}
        textAlign="bottom-center"
      />
    </Canvas>
  )
}

export default TimedMessage
