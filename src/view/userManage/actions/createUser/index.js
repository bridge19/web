import createUser from './createUser'
import Popup from '@/components/popup/index'

export default function action (contentConfig) {
  Popup.open({
    title: contentConfig.title || '创建用户',
    width: '600px',
    content: createUser,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
