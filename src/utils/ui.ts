import ArtalkContext from '../ArtalkContext'
import Utils from '.'

export default class Ui extends ArtalkContext {
  public el: HTMLElement

  constructor () {
    super()
    this.el = this.artalk.el
  }

  /**
   * 显示加载
   */
  showLoading (parentElem?: HTMLElement) {
    if (!parentElem) parentElem = this.el

    let loadingEl = parentElem.querySelector('.artalk-loading') as HTMLElement
    if (!loadingEl) {
      loadingEl = Utils.createElement('<div class="artalk-loading" style="display: none;"><div class="artalk-loading-spinner"><svg viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg></div></div>')
      parentElem.appendChild(loadingEl)
    }
    loadingEl.style.display = ''
  }

  /**
   * 隐藏加载
   */
  hideLoading (parentElem?: HTMLElement) {
    if (!parentElem) parentElem = this.el

    const loadingEl = parentElem.querySelector('.artalk-loading') as HTMLElement
    loadingEl.style.display = 'none'
  }

  /**
   * 设置全局错误
   */
  setGlobalError (html: string|HTMLElement|null) {
    let elem = this.el.querySelector('.artalk-error-layer') as HTMLElement
    if (html === null) {
      if (elem !== null) elem.remove()
      return
    }
    if (!elem) {
      elem = Utils.createElement('<div class="artalk-error-layer"><span class="artalk-error-title">Artalk Error</span><span class="artalk-error-text"></span></div>')
      this.el.appendChild(elem)
    }

    const errorTextEl = elem.querySelector('.artalk-error-text') as HTMLElement
    errorTextEl.innerHTML = ''
    if (html === null) return

    if (html instanceof HTMLElement) {
      errorTextEl.appendChild(html)
    } else {
      errorTextEl.innerText = html
    }
  }

  /**
   * 显示对话框
   */
  showDialog (parentElem: HTMLElement, html: HTMLElement, onConfirm?: (dialogElem: HTMLElement, btnElem: HTMLElement) => boolean|void, onCancel?: () => boolean|void) {
    const dialogElem = Utils.createElement('<div class="artalk-layer-dialog-wrap"><div class="artalk-layer-dialog"><div class="artalk-layer-dialog-content"></div><div class="artalk-layer-dialog-action"></div>')
    parentElem.appendChild(dialogElem)

    // 按钮
    const actionElem = dialogElem.querySelector('.artalk-layer-dialog-action')
    const onclick = (func: (dialogElem: HTMLElement, btnElem: HTMLElement) => boolean|void) => (evt: Event) => {
      const returnVal = func(dialogElem, evt.currentTarget as HTMLElement)
      if (returnVal === undefined || returnVal === true) {
        dialogElem.remove()
      }
    }
    if (typeof onConfirm === 'function') {
      const btn = Utils.createElement('<button data-action="confirm">确定</button>') as HTMLButtonElement
      btn.onclick = onclick(onConfirm)
      actionElem.appendChild(btn)
    }
    if (typeof onCancel === 'function') {
      const btn = Utils.createElement('<button data-action="cancel">取消</button>') as HTMLButtonElement
      btn.onclick = onclick(onCancel)
      actionElem.appendChild(btn)
    }

    // 内容
    dialogElem.querySelector('.artalk-layer-dialog-content').appendChild(html)
  }

  /**
   * 显示消息
   */
  showNotify (msg: string, type: 's'|'e'|'w'|'i', wrapElem: HTMLElement) {
    const colors = { s: '#57d59f', e: '#ff6f6c', w: '#ffc721', i: '#2ebcfc' }
    const timeout = 3000 // 持续显示时间 ms

    const notifyElem = Utils.createElement(`<div class="artalk-notify artalk-fade-in" style="background-color: ${colors[type]}"><span class="artalk-notify-content"></span></div>`)
    const notifyContentEl = notifyElem.querySelector('.artalk-notify-content')
    notifyContentEl.innerHTML = Utils.htmlEncode(msg).replace('\n', '<br/>')

    wrapElem.appendChild(notifyElem)

    const notifyRemove = () => {
      notifyElem.classList.add('artalk-fade-out')
      setTimeout(() => {
        notifyElem.remove()
      }, 200)
    }

    let timeoutFn: number
    if (timeout > 0) {
      timeoutFn = setTimeout(() => {
        notifyRemove()
      }, timeout)
    }

    notifyElem.addEventListener('click', () => {
      notifyRemove()
      clearTimeout(timeoutFn)
    })
  }

  /**
   * 滚动到元素中心
   */
  scrollIntoView (elem: HTMLElement) {
    if (this.isVisible(elem)) return

    const scrollDuration = 500
    const cosParameter = (elem.offsetTop - document.documentElement.clientHeight) / 2
    let scrollCount = 0
    let oldTimestamp = performance.now()
    const step = (newTimestamp: number) => {
        scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp))
        if (scrollCount >= Math.PI) window.scrollTo(0, 0)
        if (window.scrollY === 0) return
        window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)))
        oldTimestamp = newTimestamp
        window.requestAnimationFrame(step)
    }
    window.requestAnimationFrame(step)
  }

  /**
   * 元素是否用户可见
   */
  isVisible (elem: HTMLElement) {
    const docViewTop = window.scrollY
    const docViewBottom = docViewTop + document.documentElement.clientHeight

    const elemTop = Utils.getOffset(elem).top
    const elemBottom = elemTop + elem.offsetHeight

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop))
  }
}