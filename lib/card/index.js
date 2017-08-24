import { currentYPosition, elmYPosition, smoothScrollTo } from '../index.js'
import { addClass, trim } from '../comm.js'
import verge from 'verge'

export class CardBoard {
  constructor () {
    this.DOC = document
    this.deviceHeight = verge.viewportH()

    this.cardBoardContainer = {}
    this.cardBoards = []
    this.default = {}
    this.setting = {}

    this.init = this.init.bind(this)
    this.pinCardBoard = this.pinCardBoard.bind(this)
    this.scrollHandler = this.scrollHandler.bind(this)
    this.setCardEFStyle = this.setCardEFStyle.bind(this)
    this.removeCardEFStyle = this.removeCardEFStyle.bind(this)
    // this.destroy = this.destroy.bind(this)
    this.start = this.start.bind(this)
    this.pause = this.pause.bind(this)
    // this.cleanCss = this.cleanCss.bind(this)
    // this.setCss = this.setCss.bind(this)
    // this.resizeHandler = this.resizeHandler.bind(this)

    this.randomMAX = 1000000000
    this.randomMIN = 10
    this.initVersion = Math.floor(Math.random() * (this.randomMAX - this.randomMIN + 1)) + this.randomMIN

    // this.cardBoardContainerClone = {}

  }
  init ({ container = 'body', option }) {
    this.cardBoardContainer = this.DOC.querySelector(container)
    // this.cardBoardContainerClone = this.cardBoardContainer.cloneNode(true)
    this.default = {
      cardBoardContainer: '.cardBoard',
      lastCardTransparent: false,
      offset: 0
    }
    this.setting = Object.assign({}, this.default, option)
    return Promise.all([
      this.pinCardBoard()
    ])
  }
  pause () {
    window.removeEventListener('scroll', this.scrollHandler)
  }
  start () {
    window.addEventListener('scroll', this.scrollHandler)
  }
  pinCardBoard () {
    return new Promise((resolve) => {
      const cardBoardsEles = [...this.cardBoardContainer.querySelectorAll(this.setting.cardBoardContainer)]
      if (cardBoardsEles && cardBoardsEles.length > 0) {
        cardBoardsEles.map((c, i) => {
          const background = this.DOC.createElement('div')
          background.setAttribute('class', 'CB-BACK')
          background.setAttribute('style', 'position: absolute; height: 100%; width: 100%; top: 0; left: 0;')

          const id = `.${c.getAttribute('class').split(' ').join('.')}.KCCB-${i}`
          addClass(c, `KCCB-${i}`)
          const eleTopY = elmYPosition(id)
          const cardOStyle = c.getAttribute('style')
          const oHeight = c.getAttribute('o-height')
          const rawStyle = c.getAttribute('raw-style')

          const style = rawStyle
                    ? trim(`${rawStyle} height: ${Number(oHeight || c.clientHeight) + this.setting.offset}px; z-index: 102;`)
                    : trim(`${cardOStyle ? cardOStyle : ''} height: ${Number(oHeight || c.clientHeight) + this.setting.offset}px; z-index: 102;`)
          c.insertBefore(background, c.children[0])
          c.setAttribute('style', style)
          !oHeight && c.setAttribute('o-height', c.clientHeight)
          !rawStyle && c.setAttribute('raw-style', (cardOStyle || ''))
          this.cardBoards.push({
            id,
            ele: c,
            eleTopY,
            eleBtmY: eleTopY + c.clientHeight,
            cardOStyle: style
          })
        })
        this.start()
      }
      resolve(this.cardBoards)
    })
  }
  
  cleanHeight (cardBoardDoms) {
    return new Promise((resolve) => {
      cardBoardDoms.map((c, i) => {
        const id = `.${c.getAttribute('class').split(' ').join('.')}.KCCB-${i}`
        const cardOStyle = c.getAttribute('style')
        let oHeight = c.getAttribute('o-height')
        c.setAttribute('style', cardOStyle.replace( `height: ${oHeight}px; z-index: 102;`, ''))
        c.removeAttribute('o-height')
      })
      resolve()
    })
  }
  scrollHandler () {
    const currTopY = currentYPosition()
    const currBtmY = currTopY + this.deviceHeight
    this.cardBoards.map((c, i) => {
      if ((c.eleBtmY - this.setting.offset) < currBtmY && (c.eleBtmY) > currTopY) {
        this.setting.lastCardTransparent && c.ele.setAttribute('style', `${c.cardOStyle} opacity: ${( (c.eleBtmY - currTopY) / this.deviceHeight)};`)
        this.setCardEFStyle({
          id: c.id,
          ele: c.ele,
          eleBtmY: c.eleBtmY,
          currTopY
        })
      } else {
        if ((c.eleBtmY - this.setting.offset) >= currBtmY) {
          this.setting.lastCardTransparent && c.ele.setAttribute('style', c.cardOStyle)
        } else {
          this.setting.lastCardTransparent && c.ele.setAttribute('style', `${c.cardOStyle} opacity: 0;`)
        }
        this.removeCardEFStyle({
          id: c.id,
          ele: c.ele,
          eleBtmY: c.eleBtmY,
          i
        })
      }
    })    
  }
  setCardEFStyle ({ id, ele, eleBtmY, currTopY }) {
    return new Promise((resolve) => {
      const children = [...ele.children]
      if (children && children.length > 0) {
        children.map((child) => {
          const oStyle = child.getAttribute('o-style')
          const aStyle = child.getAttribute('a-style')
          const initv = child.getAttribute('initv')
          // const rawStyle = child.getAttribute('raw-style')
          const childStyle = child.getAttribute('style')

          const childPaddingBtm = Number(window.getComputedStyle(child, null).paddingBottom.replace('px', ''))
          const childPaddingTop = Number(window.getComputedStyle(child, null).paddingTop.replace('px', ''))
          const childIsCssFloat = window.getComputedStyle(child, null).float !== 'none'
          const childClass = child.getAttribute('class')
          const chilsOffsetLeft = child.offsetLeft
          const childWidth = child.clientWidth
          const childHeight = child.clientHeight

          if (aStyle && oStyle) { return }

          const childTopY = elmYPosition(`${id} .${childClass.split(' ').join('.')}`)
          const fixedBtm = eleBtmY - (childTopY + childHeight) - this.setting.offset
          const fixedTop = childTopY - currTopY
          // let cStyle = `position: fixed; bottom: ${fixedBtm}px; left: ${chilsOffsetLeft}px; z-index: 99; width: ${childWidth}px; padding-top: 1px;`
          // let cStyle = `position: fixed; bottom: ${fixedBtm}px; left: ${chilsOffsetLeft}px; z-index: 99; width: ${childWidth}px; padding-top: ${childPaddingTop}px; padding-bottom: ${childPaddingBtm}px;`
          // let cStyle = `position: fixed; top: ${fixedTop}px; left: ${chilsOffsetLeft}px; z-index: 99; width: ${childWidth}px; padding-top: ${childPaddingTop}px; padding-bottom: ${childPaddingBtm}px;`
          let cStyle = `position: fixed; top: ${fixedTop}px; left: ${chilsOffsetLeft}px; z-index: 99; width: ${childWidth}px;`
          // let cStyle = `position: fixed; bottom: ${childPaddingBtm}px; left: ${chilsOffsetLeft}px; z-index: 99; width: ${childWidth}px; padding-top: 1px;`

          // !rawStyle && child.setAttribute('raw-style',  (childStyle || ''))
          // child.setAttribute('raw-style',  (childStyle || ''))
          child.setAttribute('initv', this.initVersion)

          child.setAttribute('a-style', cStyle)
          // child.setAttribute('o-style', `${childStyle || ''}height: ${childIsCssFloat ? `${childHeight}px;` : `${childHeight - childPaddingTop - childPaddingBtm}px;`}`)
          child.setAttribute('o-style', `${childStyle || ''}height: ${childIsCssFloat ? `${childHeight}px;` : `${childHeight - childPaddingTop - childPaddingBtm}px;`}`)
          // child.setAttribute('o-style', `${childStyle || ''}height: ${childIsCssFloat ? `${childHeight}px;` : `${childHeight - childPaddingTop - childPaddingBtm}px; padding-top: ${childPaddingTop}px; padding-bottom: ${childPaddingBtm}px;`}`)
        })
        children.map((child) => {
          const style = child.getAttribute('a-style')
          const oStyle = child.getAttribute('o-style')
          if (!style || !oStyle) { return }
          child.setAttribute('style', `${oStyle}${style}`)
        })
      }
      resolve()
    })
  }
  removeCardEFStyle ({ id, ele, eleBtmY, i }) {
    return new Promise((resolve) => {
      const children = [...ele.children]
      if (children && children.length > 0) {
        children.map((child) => {
          const oStyle = child.getAttribute('o-style') || childStyle || ''
          child.setAttribute('style', oStyle)
          resolve()
        })
      } else {
        resolve()        
      }
    })    
  }
}