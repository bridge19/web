import BeforeSave from './BeforeSave'
import Popup from '@/components/popup/index'

export default function action (contentConfig) {
  Popup.open({
    title: '提示',
    width: '500px',
    content: BeforeSave,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
