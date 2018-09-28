import setRecord from './record'
import Popup from '@/components/popup/index'

export default function action (contentConfig) {
  Popup.open({
    title: '录音',
    width: '940px',
    content: setRecord,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
