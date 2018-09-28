import deleteQA from './deleteQA'
import Popup from '@/components/popup/index'

export default function action (contentConfig) {
  Popup.open({
    title: '删除问答',
    width: '500px',
    content: deleteQA,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
