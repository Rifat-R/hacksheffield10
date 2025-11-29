import { useMemo, useState } from "react";

const PRODUCTS = [
  {
    id: 1,
    name: "Lumen Linen Shirt",
    brand: "North & Co",
    price: "$78",
    tag: "New Arrival",
    bg: "linear-gradient(135deg, #fef3c7, #fde68a)",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Aero Knit Sneakers",
    brand: "Strata",
    price: "$120",
    tag: "Best Seller",
    bg: "linear-gradient(135deg, #cffafe, #22d3ee)",
    image:
      "https://images.unsplash.com/photo-1528701800489-20be9f44431d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Everyday Carry Tote",
    brand: "Field Studio",
    price: "$64",
    tag: "Limited",
    bg: "linear-gradient(135deg, #ede9fe, #c4b5fd)",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Quartz Analog Watch",
    brand: "Midnight",
    price: "$210",
    tag: "Editor’s Pick",
    bg: "linear-gradient(135deg, #fee2e2, #fecdd3)",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80"
  }
];

const DECISION = {
  LIKE: "like",
  PASS: "pass"
};

function App() {
  const [index, setIndex] = useState(0);
  const [likes, setLikes] = useState([]);
  const [passes, setPasses] = useState([]);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });

  const product = useMemo(
    () => PRODUCTS[index % PRODUCTS.length],
    [index]
  );

  const handleDecision = (direction) => {
    if (!product) return;

    if (direction === DECISION.LIKE) {
      setLikes((prev) => [...prev, product]);
    } else {
      setPasses((prev) => [...prev, product]);
    }

    setDrag({ x: 0, y: 0, active: false });
    setIndex((prev) => prev + 1);
  };

  const handlePointerDown = (e) => {
    setDrag({
      x: 0,
      y: 0,
      active: true,
      startX: e.clientX ?? 0,
      startY: e.clientY ?? 0
    });
  };

  const handlePointerMove = (e) => {
    if (!drag.active) return;
    setDrag((prev) => ({
      ...prev,
      x: (e.clientX ?? 0) - (prev.startX ?? 0),
      y: (e.clientY ?? 0) - (prev.startY ?? 0)
    }));
  };

  const handlePointerUp = () => {
    if (!drag.active) return;
    const threshold = 80;
    if (drag.x > threshold) {
      handleDecision(DECISION.LIKE);
    } else if (drag.x < -threshold) {
      handleDecision(DECISION.PASS);
    } else {
      setDrag({ x: 0, y: 0, active: false });
    }
  };

  const rotation = drag.x / 20;
  const offsetStyle = {
    transform: `translate(${drag.x}px, ${drag.y}px) rotate(${rotation}deg)`,
    transition: drag.active ? "none" : "transform 220ms ease"
  };

  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="eyebrow">Swipe through finds</p>
          <h1>Retail inspo deck</h1>
          <p className="lead">
            Swipe right to like, left to pass. We&apos;ll cycle products so you
            can keep browsing.
          </p>
        </div>
        <div className="pill">
          <span className="dot like" />
          <span className="pill-label">Likes {likes.length}</span>
          <span className="divider" />
          <span className="dot pass" />
          <span className="pill-label">Passes {passes.length}</span>
        </div>
      </header>

      <section className="deck">
        {product ? (
          <article
            className="card"
            style={{ backgroundImage: product.bg, ...offsetStyle }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <div className="card-top">
              <span className="badge">{product.tag}</span>
              <span className="price">{product.price}</span>
            </div>
            <div className="image-frame">
              <img src={product.image} alt={product.name} loading="lazy" />
            </div>
            <div className="card-info">
              <p className="brand">{product.brand}</p>
              <h2>{product.name}</h2>
              <p className="hint">Drag left/right or tap buttons below</p>
            </div>
          </article>
        ) : (
          <div className="empty">No more products</div>
        )}
      </section>

      <div className="actions">
        <button
          className="action pass"
          onClick={() => handleDecision(DECISION.PASS)}
          aria-label="Pass"
        >
          ✕ Pass
        </button>
        <button
          className="action like"
          onClick={() => handleDecision(DECISION.LIKE)}
          aria-label="Like"
        >
          ♥ Like
        </button>
      </div>
    </main>
  );
}

export default App;
