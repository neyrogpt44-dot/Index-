import { useEffect, useState } from 'react';
import { fetchInventory, ProductGroup } from './api/shop';
import './App.css';

// Тип для корзины
interface CartItem {
  id: string;
  name: string;
  price: string;
  img: string;
  size: string;
}

function App() {
  // Состояния
  const [products, setProducts] = useState<ProductGroup[]>([]);
  const [selected, setSelected] = useState<ProductGroup | null>(null);
  const [activeImg, setActiveImg] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. Загрузка товаров
  useEffect(() => {
    fetchInventory().then(data => {
      setProducts(data);
    }).catch(err => console.error("Ошибка загрузки фида:", err));
  }, []);

  // 2. Логика открытия модалки
  const openProduct = (p: ProductGroup) => {
    setSelected(p);
    const firstColorImg = Object.keys(p.colors)[0];
    setActiveImg(firstColorImg);
    setSelectedSize(""); // Сбрасываем размер при открытии нового товара
  };

  // 3. Добавление в корзину
  const addToCart = () => {
    if (!selectedSize) {
      alert("Выберите размер!");
      return;
    }
    const variant = selected!.colors[activeImg];
    const newItem: CartItem = {
      id: variant.id,
      name: selected!.name,
      price: variant.price,
      img: activeImg,
      size: selectedSize
    };
    setCart([...cart, newItem]);
    setSelected(null); // Закрываем карточку
    alert("Товар добавлен в корзину");
  };

  return (
    <div className="shop-container">
      {/* Шапка с корзиной */}
      <header className="shop-header">
        <div className="logo">SGSHOP138</div>
        <div className="cart-trigger" onClick={() => setIsCartOpen(!isCartOpen)}>
          КОРЗИНА ({cart.length})
        </div>
      </header>

      {/* Сетка товаров */}
      <main className="product-grid">
        {products.map((p, index) => (
          <div key={index} className="product-card" onClick={() => openProduct(p)}>
            <div className="card-image">
              <img src={Object.keys(p.colors)[0]} alt={p.name} />
            </div>
            <div className="card-details">
              <span className="vendor-label">{p.vendor}</span>
              <h3 className="product-title">{p.name}</h3>
              <div className="product-price">{Object.values(p.colors)[0].price} ₽</div>
            </div>
          </div>
        ))}
      </main>

      {/* МОДАЛКА КАРТОЧКИ ТОВАРА (Diafan Style) */}
      {selected && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
            
            <div className="modal-left">
              <div className="main-preview">
                <img src={activeImg} alt="selected product" />
              </div>
            </div>

            <div className="modal-right">
              <span className="modal-vendor">{selected.vendor}</span>
              <h1 className="modal-name">{selected.name}</h1>
              <div className="modal-price">{selected.colors[activeImg].price} ₽</div>

              <div className="modal-section">
                <label>ЦВЕТ</label>
                <div className="color-options">
                  {Object.keys(selected.colors).map(img => (
                    <div 
                      key={img} 
                      className={`color-item ${img === activeImg ? 'active' : ''}`}
                      onClick={() => {
                        setActiveImg(img);
                        setSelectedSize(""); // Сбрасываем размер, так как у другого цвета могут быть другие размеры
                      }}
                    >
                      <img src={img} alt="variant" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <label>РАЗМЕР (EU)</label>
                <div className="size-options">
                  {selected.colors[activeImg].sizes.sort().map(size => (
                    <button 
                      key={size} 
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button className="buy-button" onClick={addToCart}>
                ДОБАВИТЬ В КОРЗИНУ
              </button>

              <div className="modal-description">
                <label>ОПИСАНИЕ</label>
                <p>{selected.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Список корзины (простой выпадающий список) */}
      {isCartOpen && (
        <div className="cart-sidebar">
          <h2>Ваша корзина</h2>
          {cart.length === 0 ? <p>Пусто</p> : cart.map((item, i) => (
            <div key={i} className="cart-item">
              <img src={item.img} width="50" />
              <div>
                <div>{item.name}</div>
                <small>Размер: {item.size} | {item.price} ₽</small>
              </div>
            </div>
          ))}
          <button className="checkout-btn">ОФОРМИТЬ ЗАКАЗ</button>
        </div>
      )}
    </div>
  );
}

export default App;
