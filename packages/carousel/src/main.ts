import { config, itemBgImgUrl } from './static-config'
import './style.css'

const state: {
  activeIndex: number
  event: () => void
  onLeftMaskChange?: (status: 0 | 1) => void
  onRightMaskChange?: (status: 0 | 1) => void
  mouseEventData: {
    startX: number,
    movedX: number,
    isMouseDown: boolean
  }
} = {
  activeIndex: -1,
  event: () => {},
  onLeftMaskChange: undefined,
  onRightMaskChange: undefined,
  mouseEventData: {
    startX: 0,
    movedX: 0,
    isMouseDown: false
  }
}

function dragItems (items: HTMLUListElement, offset: number) {
  let targetOffset = offset;
  if (targetOffset === 0) {
    state?.onRightMaskChange?.(1)
    state?.onLeftMaskChange?.(0)
  } else {
    state?.onLeftMaskChange?.(1)
    state?.onRightMaskChange?.(1)
    if (targetOffset >= 1620) {
      state?.onRightMaskChange?.(0)
      state?.onLeftMaskChange?.(1)
    }
  }

  items.style.transform = `translateX(${targetOffset}px)`
}

function itemsDragEvent (items: HTMLUListElement) {
  items.addEventListener('mousedown', (event) => {
    state.mouseEventData.isMouseDown = true
    state.mouseEventData.startX = event.pageX
    event.stopPropagation()
  });

  items.addEventListener('mousemove', (event) => {
    if (state.mouseEventData.isMouseDown) {
      let offset = event.pageX - state.mouseEventData.startX + state.mouseEventData.movedX
      if (offset >= 0) {
        offset = 0
      }

      if (offset <= -1620) {
        offset = -1620
      }
      state.mouseEventData.movedX = offset
      state.mouseEventData.startX = event.pageX
      dragItems(items, state.mouseEventData.movedX)
    }
    event.stopPropagation()
  })

  items.addEventListener('mouseup', (event) => {
    state.mouseEventData.isMouseDown = false
    state.mouseEventData.startX = 0
    event.stopPropagation()
  })
}

function onItemChange (target?: HTMLLIElement | null) {
  if (target && !target.classList.contains('active')) {
    target.classList.add('active')
    state.event()
    state.activeIndex = Number(target.getAttribute('data-index'))
    state.event = () => {
      target.classList.remove('active')
    }
  }
}

function itemsClickEvent (items: HTMLUListElement) {
  items.addEventListener('click', function(event) {
    event.stopPropagation()
    const currentItem = (event?.target as HTMLElement)?.parentElement
    if (currentItem) {
      onItemChange(currentItem as HTMLLIElement)
    }
  })
}

function moveItems (items: HTMLUListElement, offset: number) {
  const step = 162
  let targetOffset = offset * step
  if (targetOffset >= 1620) {
    targetOffset = 1620
  }

  if (targetOffset === 0) {
    state?.onRightMaskChange?.(1)
    state?.onLeftMaskChange?.(0)
  } else {
    state?.onLeftMaskChange?.(1)
    state?.onRightMaskChange?.(1)
    if (targetOffset >= 1620) {
      state?.onRightMaskChange?.(0)
      state?.onLeftMaskChange?.(1)
    }
  }
  targetOffset *= -1
  items.style.transform = `translateX(${targetOffset}px)`
}

function itemsKeydownEvent (items: HTMLUListElement) {
  window.addEventListener('keydown', function(event: KeyboardEvent) {
    if (event) {
      let offset = 0
      let index = state.activeIndex
      if (event.key === 'ArrowRight') {
        index += 1
        if (index >= 6) {
          offset = index - 5
        }

        index = index > items.childNodes.length ? items.childNodes.length - 1 : index
      }

      if (event.key === 'ArrowLeft') {
        index -= 1
        offset = index - 6

        if (index <= 6) {
          offset = 0
        }
        index = index < 0 ? 0 : index
      }

      onItemChange(items.childNodes[index] as HTMLLIElement)
      moveItems(items, offset)
    }
  })
}

function setItemImgAttribute(itemImg: HTMLImageElement, options: {
  imgUrl: string
}) {
  const { imgUrl } = options
  itemImg.classList.add('item-img')
  itemImg.setAttribute('src', imgUrl)
}

function setItemBgImgAttribute(itemBgImg: HTMLImageElement) {
  itemBgImg.classList.add('item-bg-img')
  itemBgImg.setAttribute('src', itemBgImgUrl)
}

function getItems () {
  const wrapper = document.createElement('ul')
  wrapper.classList.add('items-wrapper')

  config?.forEach?.((imgUrl, i) => {
    const item = document.createElement('li')
    const itemImg = document.createElement('img')
    const itemBgImg = document.createElement('img')
    item.classList.add('item')
    item.setAttribute('data-index', `${i}`)

    
    setItemImgAttribute(itemImg, {
      imgUrl
    })

    setItemBgImgAttribute(itemBgImg)

    item.appendChild(itemBgImg)
    item.appendChild(itemImg)
    wrapper.appendChild(item)
  })

  return wrapper
}

function render () {
  const app = document.getElementById('app');
  const container = document.createElement('div')
  const content = document.createElement('div')
  container.classList.add('carousel-container', 'mask-left')

  const contentCLassList = ['carousel-content', 'mask-right']
  if (config.length > 12) {
    contentCLassList.push('hidden')
  }
  content.classList.add(...contentCLassList)

  const items = getItems()
  itemsClickEvent(items)
  itemsKeydownEvent(items)
  itemsDragEvent(items)
  state.onLeftMaskChange = (status: 0 | 1) => {
    if (status === 0) {
      container.classList.remove('active')
    } else {
      container.classList.add('active')
    }
  }

  state.onRightMaskChange = (status: 0 | 1) => {
    if (status === 0) {
      content.classList.remove('active')
    } else {
      content.classList.add('active')
    }
  }

  state.onRightMaskChange(1)

  content.appendChild(items)
  container.appendChild(content)
  app?.appendChild(container)
  
  return {
    init() {
      onItemChange(items.childNodes[Math.round(Math.random() * 11)] as HTMLLIElement)
    }
  }
}

render().init()
