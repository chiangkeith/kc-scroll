import { currentYPosition, elmYPosition, smoothScrollTo } from './index.js'
import { addClass } from './comm.js'
const DOC = document
const DEVICE_HEIGHT = DOC.documentElement.clientHeight || DOC.body.clientHeight

export class CardBoard {
  constructor () {
    this.cardBoardContainer = {}
    this.cardBoards = []
    this.default = {}
    this.setting = {}

    this.init = this.init.bind(this)
    this.pinCardBoard = this.pinCardBoard.bind(this)
    this.scrollHandler = this.scrollHandler.bind(this)
    this.setCardEFStyle = this.setCardEFStyle.bind(this)
    this.removeCardEFStyle = this.removeCardEFStyle.bind(this)
  }
  init ({container, option}) {
    this.cardBoardContainer = DOC.querySelector(container)
    this.default = {
      cardBoardContainer: '.cardBoard'
    }
    this.setting = Object.assign({}, this.default, this.option)
    return Promise.all([
      this.pinCardBoard()
    ])
  }
  pinCardBoard () {
    return new Promise((resolve) => {
      const cardBoardsEles = DOC.querySelectorAll(this.setting.cardBoardContainer)
      if (cardBoardsEles && cardBoardsEles.length > 0) {
        cardBoardsEles.map((c, i) => {
          const id = `.${c.getAttribute('class').split(' ').join('.')}.KCCB-${i}`
          const eleTopY = elmYPosition(id)
          const cardOStyle = c.getAttribute('style')
          const style = cardOStyle ? `${cardOStyle}; height:${c.clientHeight}px; z-index: 12;` : `height:${c.clientHeight}px; z-index: 12;`
          addClass(c, `KCCB-${i}`)
          c.setAttribute('style', style)
          this.cardBoards.push({
            id,
            ele: c,
            eleTopY,
            eleBtmY: eleTopY + c.clientHeight,
            cardOStyle: style
          })
        })
        window.addEventListener('scroll', this.scrollHandler)
      }
      resolve()
    })
  }
  scrollHandler () {
    const currTopY = currentYPosition()
    const currBtmY = currTopY + DEVICE_HEIGHT

    this.cardBoards.map((c) => {
      if (c.eleBtmY < currBtmY && c.eleBtmY > currTopY) {
        c.ele.setAttribute('style', `${c.cardOStyle} opacity: ${( (c.eleBtmY - currTopY) / this.deviceHight)};`)
        this.setCardEFStyle({
          id: c.id,
          ele: c.ele,
          eleBtmY: c.eleBtmY,
          currTopY
        })
      } else {
        if (c.eleBtmY >= currBtmY) {
          c.ele.setAttribute('style', c.cardOStyle)
        } else {
          c.ele.setAttribute('style', `${c.cardOStyle} opacity: 0;`)
        }
        this.removeCardEFStyle({
          id: c.id,
          ele: c.ele
        })
      }
    })    
  }
  setCardEFStyle ({ id, ele, eleBtmY, currTopY }) {
    return new Promise((resolve) => {
      const children = ele.children
      if (children && children.length > 0) {
        children.map((child) => {
          const childClass = child.getAttribute('class')
          const childStyle = child.getAttribute('style')
          const chilsOffsetLeft = child.offsetLeft
          const childWidth = child.clientWidth
          
          child.setAttribute('style', 'position: relative;' + (childClass.indexOf('brief') > -1 ? 'z-index: 10 !important;' : ''))
          const childTopY = elmYPosition(`${id} .${childClass.split(' ').join('.')}`)
          let cStyle = `position: fixed; bottom: ${eleBtmY - (childTopY + child.clientHeight)}px;
                          left: ${chilsOffsetLeft}px; z-index: 9; width: ${childWidth}px; padding-top: 1px;`
          let oStyle = child.getAttribute('style')
          child.setAttribute('a-style', cStyle)
          child.setAttribute('o-style', oStyle)
        })
        children.map((child) => {
          const style = child.getAttribute('a-style')
          const oStyle = child.getAttribute('o-style')
          child.setAttribute('style', `${oStyle}${style}`)
        })
      }
      resolve()
    })
  }
  removeCardEFStyle ({ id, ele }) {
    return new Promise((resolve) => {
      const children = ele.children
      if (children && children.length > 0) {
        children.map((child) => {
          const oStyle = child.getAttribute('o-style') || child.getAttribute('style') || ''
          child.setAttribute('style', oStyle)
        })
      }
      resolve()
    })    
  }
}