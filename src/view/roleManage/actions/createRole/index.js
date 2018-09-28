import createRole from './createRole'
import Popup from '@/components/popup/index'

export default function action (contentConfig) {
  Popup.open({
    title: contentConfig.title || '新建角色',
    width: '764px',
    content: createRole,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
