import changePassword from './changePassword'
import Popup from '@/components/popup2/index'

export default function action (contentConfig) {
  Popup.open({
    title: '修改密码',
    width: '600px',
    content: changePassword,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
