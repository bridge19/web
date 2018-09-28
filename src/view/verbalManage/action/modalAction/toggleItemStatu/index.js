import toggleItemStatu from './toggleItemStatu'
import Popup from '@/components/popup/index'

export default function action (item) {
  Popup.open({
    title: item.toggle + '模板',
    width: '500px',
    height: '300px',
    content: toggleItemStatu,
    contentConfig: item,
    close: () => {
      Popup.close()
    }
  })
}
