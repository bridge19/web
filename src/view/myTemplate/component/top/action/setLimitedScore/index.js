import setLimitedScore from './setLimitedScore'
import Popup from '@/components/popup/index'

export default function action (contentConfig) {
  Popup.open({
    title: '门限值分数',
    width: '600px',
    content: setLimitedScore,
    contentConfig: contentConfig,
    close: () => {
      Popup.close()
    }
  })
}
