import createT from './createT'
import Popup from '@/components/popup/index'

export default function action (contentConfig) {
  Popup.open({
    title: contentConfig.title || '新建模版',
    width: '600px',
    content: createT,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
