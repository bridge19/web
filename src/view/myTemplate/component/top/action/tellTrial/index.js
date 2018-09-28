import telTrial from './telTrial'
import Popup from '@/components/popup/index'

export default function action (contentConfig) {
  Popup.open({
    title: '输入号码',
    width: '500px',
    content: telTrial,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
