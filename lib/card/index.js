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
    this.cleanCss = this.cleanCss.bind(this)
    this.setCss = this.setCss.bind(this)

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
  // destroy () {
  //   this.cardBoardContainer = {}
  //   this.cardBoards = []
  //   this.default = {}
  //   this.setting = {}
  // }
  pause () {
    window.removeEventListener('scroll', this.scrollHandler)
  }
  start () {
    window.addEventListener('scroll', this.scrollHandler)
  }
  // refresh ({ container = 'body', option }) {
  //   this.destroy()
  //   this.initVersion++
  //   return this.init({ container, option })
  // }
  pinCardBoard () {
    return new Promise((resolve) => {
      const cardBoardsEles = [...this.cardBoardContainer.querySelectorAll(this.setting.cardBoardContainer)]
      if (cardBoardsEles && cardBoardsEles.length > 0) {
        cardBoardsEles.map((c, i) => {
          const id = `.${c.getAttribute('class').split(' ').join('.')}.KCCB-${i}`
          addClass(c, `KCCB-${i}`)
          const eleTopY = elmYPosition(id)
          const cardOStyle = c.getAttribute('style')
          const oHeight = c.getAttribute('o-height')
          const rawStyle = c.getAttribute('raw-style')
          // const style = `${rawStyle} height: ${Number(oHeight) + this.setting.offset}px; z-index: 102;`
          const style = rawStyle
                    ? trim(`${rawStyle} height: ${Number(oHeight || c.clientHeight) + this.setting.offset}px; z-index: 102;`)
                    : trim(`${cardOStyle ? cardOStyle : ''} height: ${Number(oHeight || c.clientHeight) + this.setting.offset}px; z-index: 102;`)
          // const paddingBtm = c.currentStyle ? c.currentStyle['padding-left'] : window.getComputedStyle(c, null).display
          // console.log({
          //   'getPropertyValue': window.getComputedStyle(c, null).getPropertyValue('padding-bottom'),
          //   'getComputedStyle': window.getComputedStyle(c, null)['padding-bottom'],
          //   'getComputedStyle1': window.getComputedStyle(c, null).paddingBottom,
            // 'getComputedStyle': window.getComputedStyle(c, null),
            // 'c.currentStyle': c.currentStyle
          // })
          // const childPaddingBtm = Number(window.getComputedStyle(c, null).paddingBottom.replace('px', ''))
          // const childPaddingTop = Number(window.getComputedStyle(c, null).paddingTop.replace('px', ''))
          // console.log({
          //   id,
          //   childPaddingBtm,
          //   childPaddingTop,
          //   // eleBtmY,
          //   // childTopY,
          //   // childHeight,
          //   // bottom: eleBtmY - (childTopY + childHeight)
          // })
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
          // console.log({
          //   id,
          //   ele: c,
          //   eleTopY,
          //   eleBtmY: eleTopY + c.clientHeight,
          //   cardOStyle: style
          // })
        })
        this.start()
      }
      resolve(this.cardBoards)
    })
  }
  refreshCardBoard () {
    this.cardBoards = []
    this.deviceHeight = verge.viewportH()
    this.initVersion = Math.floor(Math.random() * (this.randomMAX - this.randomMIN + 1)) + this.randomMIN
    return new Promise((resolve) => {
      // console.log(
      //   [
      //     this.cardBoardContainer,
      //     this.cardBoardContainer.parentNode
      //   ]
      // )
      // this.cardBoardContainer.parentNode.replaceChild(this.cardBoardContainerClone, this.cardBoardContainer)
      const cardBoardsEles = [...this.cardBoardContainer.querySelectorAll(this.setting.cardBoardContainer)]
      if (cardBoardsEles && cardBoardsEles.length > 0) {
        this.cleanHeight(cardBoardsEles).then(() => {
          // cardBoardsEles.map((c, i) => {
          //   const id = `.${c.getAttribute('class').split(' ').join('.')}.KCCB-${i}`
          //   const eleTopY = elmYPosition(id)
          //   const cardOStyle = c.getAttribute('style')

          //   // let oHeight = c.getAttribute('o-height')
          //   // const tempStyle = c.getAttribute('style')
          //   // console.log('clientHeight', c.clientHeight)
          //   // console.log('tempStyle', tempStyle)
          //   // console.log('remove height', tempStyle.replace( `height: ${oHeight}px;`, '').replace( `height:${oHeight}px;`, ''))
          //   // c.setAttribute('style', cardOStyle.replace( `height: ${oHeight}px;`, '').replace( `height:${oHeight}px;`, ''))
          //   // console.log('clientHeight(after)', c.clientHeight)
          //   oHeight = c.clientHeight
          //   // console.log('now height should be', c.clientHeight)
          //   // console.log('oHeight', oHeight)
          //   // const oHeight = c.clientHeight
          //   const rawStyle = c.getAttribute('raw-style')
          //   const style = `${rawStyle} height: ${Number(oHeight) + this.setting.offset}px; z-index: 102;`
            
          //   // c.setAttribute('o-height', oHeight)
          //   // c.setAttribute('style', style)
          //   // this.cardBoards.push({
          //   //   id,
          //   //   ele: c,
          //   //   eleTopY,
          //   //   eleBtmY: eleTopY + c.clientHeight,
          //   //   cardOStyle: style
          //   // })
          // })
          // setTimeout(() => {
          //   cardBoardsEles.map((c, i) => {
          //     console.log(c.clientHeight)
          //   })
          // }, 5000)
          // this.start()
          // return this.pinCardBoard().then(() => {
          //   resolve(this.cardBoards)
          // })
          setTimeout(() => {
            return this.pinCardBoard().then(() => {
              resolve(this.cardBoards)
            })
            // cardBoardsEles.map((c, i) => {
              // console.log(c.clientHeight)
              
            // })
          }, 50)
        })
      } else {
        resolve(this.cardBoards)
      }

    })
  }
  // calculateCardBoards (cardBoardDoms) {
  //   return new Promise((resolve) => {
  //     const cardBoardsOrigin = []
  //     _.map(cardBoardDoms, (c, i) => {
  //       const id = `.${c.getAttribute('class').split(' ').join('.')}.KCCB-${i}`
  //       const eleTopY = elmYPosition(id)
  //       const cardOStyle = c.getAttribute('style')

  //       let oHeight = c.getAttribute('o-height')
  //       !oHeight && c.setAttribute('style', cardOStyle.replace( `height: ${oHeight}px;`, '').replace( `height:${oHeight}px;`, ''))


  //     })
  //     resolve(cardBoardsOrigin)
  //   })

  // } 
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
  cleanCss ({ ele, currStyle, rawStyle, oStyle }) {
    return new Promise((resolve) => {
      // const styleArr = rawStyle.split(';')
      // const currStyleArr = currStyle.split(';')
      const oStyleArr = oStyle ? oStyle.split(';') : []
      let tidyStyle = currStyle
      for (let i = 0; i < oStyleArr.length; i += 1) {
        // console.log('oStyleArr['+i+']', oStyleArr[i], tidyStyle.indexOf(`${oStyleArr[i]};`))
        tidyStyle = tidyStyle.replace(`${oStyleArr[i]};`, '')
      }
      // console.log('tidyStyle', tidyStyle)
      ele.setAttribute('style', tidyStyle)
      ele.setAttribute('raw-style', tidyStyle)
      ele.removeAttribute('o-style')
      ele.removeAttribute('a-style')
      resolve()
    })
  }
  scrollHandler () {
    console.log('scroll')

    const currTopY = currentYPosition()
    const currBtmY = currTopY + this.deviceHeight
    // console.log('cards num:', this.cardBoards.length)
    this.cardBoards.map((c, i) => {
      // if (i === 0) {
      //   console.log(c.id, 'in')
      //   console.log('this.setting.offset', this.setting.offset)
      //   console.log('c.eleBtmY', c.eleBtmY)
      //   console.log('currTopY', currTopY)
      //   console.log('currBtm', currBtmY)
      // }
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
          const rawStyle = child.getAttribute('raw-style')
          const childStyle = child.getAttribute('style')

          if (this.initVersion == initv) {
            return
          } else if (initv != null) {
            // console.log('######## initv != null', initv)
            // console.log('initVersion', this.initVersion)
            this.cleanCss({
              ele: child,
              rawStyle: rawStyle,
              currStyle: childStyle,
              oStyle
            }).then(() => {
              // console.log('clean')
              console.log('clean and set css', id)
              child.setAttribute('initv', this.initVersion)

              return this.setCss({
                id,
                child,
                eleBtmY,
                rawStyle,
                childStyle
              })

              





            })
            return
          } else {
            this.setCss({
              id,
              child,
              eleBtmY,
              rawStyle,
              childStyle
            })
          //   console.log('initv === undefined s', initv)
          //   console.log('initVersion', this.initVersion)
          //   const childPaddingBtm = Number(window.getComputedStyle(child, null).paddingBottom.replace('px', ''))
          //   const childPaddingTop = Number(window.getComputedStyle(child, null).paddingTop.replace('px', ''))
          //   const childIsCssFloat = window.getComputedStyle(child, null).float !== 'none'
          //   const childClass = child.getAttribute('class')
          //   const chilsOffsetLeft = child.offsetLeft
          //   const childWidth = child.clientWidth
          //   const childHeight = child.clientHeight

            
          //   // console.log({
          //   //   initVersion: this.initVersion,
          //   //   initv
          //   // })
          //   // if (aStyle && oStyle && this.initVersion === initv) { return }
          //   // if (aStyle && oStyle) { return }

            
          //   // child.setAttribute('style', 'position: relative;' + (childClass.indexOf('brief') > -1 ? 'z-index: 100 !important;' : ''))
          //   const childTopY = elmYPosition(`${id} .${childClass.split(' ').join('.')}`)
          //   // oStyle = `${oStyle}position: relative;${(childClass.indexOf('brief') > -1 ? 'z-index: 100 !important;' : '')}`
          //   const fixedBtm = eleBtmY - (childTopY + childHeight) - this.setting.offset
          //   // let cStyle = `position: fixed; bottom: ${fixedBtm}px; left: ${chilsOffsetLeft}px; z-index: 99; width: ${childWidth}px; padding-top: 1px;`
          //   let cStyle = `position: fixed; bottom: ${fixedBtm}px; left: ${chilsOffsetLeft}px; z-index: 99; width: ${childWidth}px; padding-top: ${childPaddingTop}px; padding-bottom: ${childPaddingBtm}px;`
          //   // let cStyle = `position: fixed; bottom: ${childPaddingBtm}px; left: ${chilsOffsetLeft}px; z-index: 99; width: ${childWidth}px; padding-top: 1px;`
          //   // let oStyle = child.getAttribute('o-style')
          //   // child.setAttribute('a-style', cStyle)
          //   // child.setAttribute('o-style', oStyle)

          //   !rawStyle && child.setAttribute('raw-style',  (childStyle || ''))
          //   child.setAttribute('initv', this.initVersion)

          //   child.setAttribute('a-style', cStyle)
          //   // child.setAttribute('o-style', `${childStyle}height: ${childHeight - childPaddingTop - childPaddingBtm}px; padding-top: ${childPaddingTop}px; padding-bottom: ${childPaddingBtm}px;`)
          //   // if (this.initVersion != initV) {
          //     console.log('height(childIsCssFloat)', childHeight)
          //     console.log('height', childHeight - childPaddingTop - childPaddingBtm)
          //     if (!rawStyle) {
          //       console.log('o-style',childStyle)
          //       console.log('o-style',rawStyle)
          //       child.setAttribute('o-style', `${childStyle || ''}height: ${childIsCssFloat ? `${childHeight}px;` : `${childHeight - childPaddingTop - childPaddingBtm}px; padding-top: ${childPaddingTop}px; padding-bottom: ${childPaddingBtm}px;`}`)
          //     } else {
          //       child.setAttribute('o-style', `${rawStyle || ''}height: ${childIsCssFloat ? `${childHeight}px;` : `${childHeight - childPaddingTop - childPaddingBtm}px; padding-top: ${childPaddingTop}px; padding-bottom: ${childPaddingBtm}px;`}`)              
          //     }
          //     // child.setAttribute('initv', this.initVersion)
          //   // }
          //   // child.setAttribute('o-style', `${childStyle}height: ${childHeight}`)

          }

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
  setCss ({ child, eleBtmY, id, rawStyle, childStyle }) {
    return new Promise((resolve) => {
            // console.log('initv === undefined s', initv)
            // console.log('initVersion', this.initVersion)
            const childPaddingBtm = Number(window.getComputedStyle(child, null).paddingBottom.replace('px', ''))
            const childPaddingTop = Number(window.getComputedStyle(child, null).paddingTop.replace('px', ''))
            const childIsCssFloat = window.getComputedStyle(child, null).float !== 'none'
            const childClass = child.getAttribute('class')
            const chilsOffsetLeft = child.offsetLeft
            const childWidth = child.clientWidth
            const childHeight = child.clientHeight

            
            // console.log({
            //   initVersion: this.initVersion,
            //   initv
            // })
            // if (aStyle && oStyle && this.initVersion === initv) { return }
            // if (aStyle && oStyle) { return }

            
            // child.setAttribute('style', 'position: relative;' + (childClass.indexOf('brief') > -1 ? 'z-index: 100 !important;' : ''))
            const childTopY = elmYPosition(`${id} .${childClass.split(' ').join('.')}`)
            // oStyle = `${oStyle}position: relative;${(childClass.indexOf('brief') > -1 ? 'z-index: 100 !important;' : '')}`
            const fixedBtm = eleBtmY - (childTopY + childHeight) - this.setting.offset
            // let cStyle = `position: fixed; bottom: ${fixedBtm}px; left: ${chilsOffsetLeft}px; z-index: 99; width: ${childWidth}px; padding-top: 1px;`
            let cStyle = `position: fixed; bottom: ${fixedBtm}px; left: ${chilsOffsetLeft}px; z-index: 99; width: ${childWidth}px; padding-top: ${childPaddingTop}px; padding-bottom: ${childPaddingBtm}px;`
            // let cStyle = `position: fixed; bottom: ${childPaddingBtm}px; left: ${chilsOffsetLeft}px; z-index: 99; width: ${childWidth}px; padding-top: 1px;`
            // let oStyle = child.getAttribute('o-style')
            // child.setAttribute('a-style', cStyle)
            // child.setAttribute('o-style', oStyle)

            !rawStyle && child.setAttribute('raw-style',  (childStyle || ''))
            child.setAttribute('initv', this.initVersion)

            child.setAttribute('a-style', cStyle)
            // child.setAttribute('o-style', `${childStyle}height: ${childHeight - childPaddingTop - childPaddingBtm}px; padding-top: ${childPaddingTop}px; padding-bottom: ${childPaddingBtm}px;`)
            // if (this.initVersion != initV) {
              // console.log('height(childIsCssFloat)', childHeight)
              // console.log('height', childHeight - childPaddingTop - childPaddingBtm)
              if (!rawStyle) {
                // console.log('o-style',childStyle)
                // console.log('o-style',rawStyle)
                child.setAttribute('o-style', `${childStyle || ''}height: ${childIsCssFloat ? `${childHeight}px;` : `${childHeight - childPaddingTop - childPaddingBtm}px; padding-top: ${childPaddingTop}px; padding-bottom: ${childPaddingBtm}px;`}`)
              } else {
                child.setAttribute('o-style', `${rawStyle || ''}height: ${childIsCssFloat ? `${childHeight}px;` : `${childHeight - childPaddingTop - childPaddingBtm}px; padding-top: ${childPaddingTop}px; padding-bottom: ${childPaddingBtm}px;`}`)              
              }
              // child.setAttribute('initv', this.initVersion)
            // }
            // child.setAttribute('o-style', `${childStyle}height: ${childHeight}`)

      
      resolve()
    })
  }
  removeCardEFStyle ({ id, ele, eleBtmY, i }) {
    return new Promise((resolve) => {
      const children = [...ele.children]
      if (children && children.length > 0) {
        children.map((child) => {
          const initv = child.getAttribute('initv')
          const rawStyle = child.getAttribute('raw-style')
          const childStyle = child.getAttribute('style')
          const oStyle = child.getAttribute('o-style') || childStyle || ''
          if (i === 1) { console.log('449') }
          if (this.initVersion != initv && initv) {
            console.log('clean', id)
            this.cleanCss({
              ele: child,
              rawStyle,
              currStyle: childStyle,
              oStyle
            }).then(() => {
              if (i === 1) { console.log('458') }
              // child.setAttribute('initv', this.initVersion)
              resolve()
            })
          } else {
            if (i === 1) { console.log('463') }
            const oStyle = child.getAttribute('o-style') || childStyle || ''
            child.setAttribute('style', oStyle)
            resolve()
          }
          const oStyle = child.getAttribute('o-style') || childStyle || ''
          child.setAttribute('style', oStyle)

        })
      } else {
        resolve()        
      }
    })    
  }
}