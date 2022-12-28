import { useCallback, useState } from 'react'
import './App.css'

function mock () {
  const len = Math.floor(Math.random() * 20)
  return new Array(len).fill({
    name: '商品',
    price: Number((Math.random() * 1000).toFixed(2)),
    desc: '商品描述'
  }).map((o, i) => ({
    ...o,
    name: o.name + i + 1,
    desc: o.desc + i + 1
  }))
}

interface IItem { name: string, price: number, desc: string, count: number }

const data = mock()
function App() {
  const [showCart, setShowCart] = useState(false)
  const [showTotal, setShowTotal] = useState(false)
  const [items, setItems] = useState([] as IItem[])
  const show = useCallback(() => {
    setShowCart(true)
  }, [])

  const hide = useCallback(() => {
    setShowCart(false)
    setShowTotal(false)
  }, [])

  const add = useCallback((item: IItem) => {
    const newData = [...items]
    const index = newData.findIndex((o) => o.name === item.name)
    if (index !== -1) {
      newData[index].count += 1
      setItems(newData)
    } else {
      const newItem = item
      newItem.count = 1
      setItems([...items, newItem])
    }
    
  }, [items])

  const remove = useCallback((item: IItem) => {
    setItems(items.filter((o) => o.name !== item.name))
  }, [items])

  const sum = useCallback(() => {
    setShowTotal(true)
  }, [items])

  const total = Number(items?.reduce((s, i) => {
    return s + i.price * i.count
  }, 0)?.toFixed(2))

  return (
    <div className='App'>
      <div className='header'>
        <h1>购物天堂</h1>
        <div className='right' onMouseLeave={hide}>
          <button onMouseEnter={show}>购物车</button>
          {showCart && (<div className='cart'>
            {items?.map?.((item) => (
            <div className='cart-item' key={item.name}>
              <div>{item.name}</div>
              <div>
                {item.price} * {item.count}
                <button onClick={() => remove(item)}>删除</button>
              </div>
            </div>))}
            {showTotal && <div>{total}</div>}
            <button onClick={sum}>购买</button>
          </div>)}
        </div>
      </div>
      <div className='main'>
        {
          data?.map?.((item) => (
            <div className='item' key={item.name + 'cart'}>
              <div className='item-content'>
                <div className='img'></div>
                <div className='detail'>
                  <div className='name'>{item.name}</div>
                  <div className='price'>{item.price}<button onClick={() => add(item)}>加入购物车</button></div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App
