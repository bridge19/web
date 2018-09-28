import textTrial from './textTrial'
import Popup from '@/components/popup/index'

export default function action (contentConfig) {
  Popup.open({
    title: '文字试用',
    width: '668px',
    content: textTrial,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
