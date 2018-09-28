import deleteConfirm from './deleteConfirm'
import Popup from '@/components/popup2/index'

export default function action (contentConfig) {
  Popup.open({
    title: contentConfig.title || '删除',
    width: '500px',
    content: deleteConfirm,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
