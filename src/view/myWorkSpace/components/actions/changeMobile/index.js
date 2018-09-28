import changeMobile from './changeMobile'
import Popup from '@/components/popup2/index'

export default function action (contentConfig) {
  Popup.open({
    title: '修改手机号',
    width: '600px',
    content: changeMobile,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
