import jumpToSubject from './jumpToSubject'
import Popup from '@/components/popup/index'

export default function action (contentConfig) {
  Popup.open({
    title: '添加问答',
    width: '500px',
    content: jumpToSubject,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
