import createTheme from './createTheme'
import Popup from '@/components/popup/index'

export default function action (contentConfig) {
  let title = contentConfig.title
  Popup.open({
    title: title || '添加主题',
    width: '500px',
    content: createTheme,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
