import { useEffect, useState } from 'react';
import { fetchInventory, ProductGroup } from './api/shop';
import './App.css';

interface CartItem {
  id: string;
  name: string;
  price: string;
  img: string;
  size: string;
}

function App() {
  const [products, setProducts] = useState<ProductGroup[]>([]);
  const [selected, setSelected] = useState<ProductGroup | null>(null);
  const [activeImg, setActiveImg] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);

  // Загрузка данных при запуске
  useEffect(() => {
    fetchInventory().then(setProducts).catch(console.error);
  }, []);

  const openProduct = (p: ProductGroup) => {
    setSelected(p);
    setActiveImg(Object.keys(p.colors)[0]);
    setSelectedSize(""); 
  };

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
    alert("Добавлено в корзину!");
    setSelected(null);
  };

  return (
    <div className="shop-container">
      <header className="header">
        <div className="logo">SGSHOP138</div>
        <div className="cart-status">КОРЗИНА: {cart.length}</div>
      </header>

      <main className="product-grid">
        {products.map((p, i) => (
          <div key={i} className="product-card" onClick={() => openProduct(p)}>
            <img src={Object.keys(p.colors)[0]} alt={p.name} />
            <div className="card-info">
              <span className="brand">{p.vendor}</span>
              <h3 className="name">{p.name}</h3>
              <div className="price">{Object.values(p.colors)[0].price} ₽</div>
            </div>
          </div>
        ))}
      </main>

      {selected && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
            <div className="modal-left">
              <img src={activeImg} className="main-view" alt="product" />
            </div>
            <div className="modal-right">
              <span className="m-brand">{selected.vendor}</span>
              <h1 className="m-name">{selected.name}</h1>
              <div className="m-price">{selected.colors[activeImg].price} ₽</div>

              <div className="m-label">ЦВЕТ</div>
              <div className="color-picker">
                {Object.keys(selected.colors).map(img => (
                  <div 
                    key={img} 
                    className={`color-item ${img === activeImg ? 'active' : ''}`}
                    onClick={() => { setActiveImg(img); setSelectedSize(""); }}
                  >
                    <img src={img} alt="color variant" />
                  </div>
                ))}
              </div>

              <div className="m-label">РАЗМЕР (EU)</div>
              <div className="size-picker">
                {selected.colors[activeImg].sizes.sort().map(s => (
                  <button 
                    key={s} 
                    className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button className="add-btn" onClick={addToCart}>В КОРЗИНУ</button>
              
              <div className="m-desc">
                <div className="m-label">ОПИСАНИЕ</div>
                <p>{selected.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
