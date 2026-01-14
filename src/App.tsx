import { useEffect, useState } from 'react';
import { fetchInventory, ProductGroup } from './api/shop';
import './App.css';

function App() {
  const [products, setProducts] = useState<ProductGroup[]>([]);
  const [selected, setSelected] = useState<ProductGroup | null>(null);
  const [activeImg, setActiveImg] = useState<string>("");

  // Загружаем товары при старте
  useEffect(() => {
    fetchInventory().then(data => setProducts(data));
  }, []);

  const openProduct = (p: ProductGroup) => {
    setSelected(p);
    setActiveImg(Object.keys(p.colors)[0]); // Выбираем первый цвет по умолчанию
  };

  return (
    <div className="shop-wrap">
      {/* Сетка товаров */}
      <div className="product-grid">
        {products.map(p => (
          <div key={p.name} className="p-card" onClick={() => openProduct(p)}>
            <img src={Object.keys(p.colors)[0]} alt={p.name} />
            <div className="p-info">
              <span className="vendor">{p.vendor}</span>
              <h3>{p.name}</h3>
              <p>{Object.values(p.colors)[0].price} ₽</p>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно (Карточка товара как в Diafan) */}
      {selected && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-x" onClick={() => setSelected(null)}>×</button>
            
            <div className="modal-left">
              <img src={activeImg} alt="main" className="big-img" />
            </div>

            <div className="modal-right">
              <span className="m-vendor">{selected.vendor}</span>
              <h1 className="m-title">{selected.name}</h1>
              <div className="m-price">{selected.colors[activeImg].price} ₽</div>

              <div className="m-section">
                <label>ДОСТУПНЫЕ ЦВЕТА:</label>
                <div className="color-swatches">
                  {Object.keys(selected.colors).map(img => (
                    <div 
                      key={img} 
                      className={`swatch ${img === activeImg ? 'active' : ''}`}
                      onClick={() => setActiveImg(img)}
                    >
                      <img src={img} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="m-section">
                <label>РАЗМЕРЫ (EU):</label>
                <div className="size-chips">
                  {selected.colors[activeImg].sizes.map(s => (
                    <div key={s} className="size-chip">{s}</div>
                  ))}
                </div>
              </div>

              <button className="add-to-cart">ДОБАВИТЬ В КОРЗИНУ</button>
              
              <div className="m-desc">
                <label>ОПИСАНИЕ</label>
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
