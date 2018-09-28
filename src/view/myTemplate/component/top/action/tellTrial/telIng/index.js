import telIng from './telIng'
import Popup from '@/components/popup/index'

export default function action (contentConfig) {
  Popup.open({
    title: '正在拨号...',
    width: '500px',
    content: telIng,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
