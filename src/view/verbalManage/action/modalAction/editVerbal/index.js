import editVerbal from './editVerbal'
import Popup from '@/components/popup/index'

export default function action (item) {
  Popup.open({
    title: item.title,
    width: '600px',
    content: editVerbal,
    contentConfig: item,
    close: () => {
      Popup.close()
    }
  })
}
