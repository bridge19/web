import renamePlate from './renamePlate'
import Popup from '@/components/popup/index'

export default function action (contentConfig) {
  Popup.open({
    title: '版块重命名',
    width: '500px',
    content: renamePlate,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
