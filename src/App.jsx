import { useMemo, useState } from 'react';

const initialItems = [
  { id: 1, name: 'Tomates de Árbol Rojos', price: 18500, qty: 2, farm: 'Huerto Los Olivos', image: 'https://images.unsplash.com/photo-1592841200221-8f6b8e58e2a8?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Arúgula de Hoja Grande', price: 6200, qty: 1, farm: 'Huerto Los Olivos', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Huevos de Pastoreo (Docena)', price: 14000, qty: 1, farm: 'Granja Tierra Viva', image: 'https://images.unsplash.com/photo-1506975094-869200fa7b10?auto=format&fit=crop&w=300&q=80' }
];

const navItems = [
  { key: 'cart', label: 'Cesta', icon: 'shopping_basket' },
  { key: 'checkout', label: 'Pago', icon: 'credit_card' },
  { key: 'confirmation', label: 'Pedido', icon: 'done_all' },
  { key: 'messages', label: 'Mensajes', icon: 'chat' },
  { key: 'logistics', label: 'Logística', icon: 'local_shipping' },
  { key: 'profile', label: 'Perfil', icon: 'account_circle' }
];

function App() {
  const [view, setView] = useState('cart');
  const [items, setItems] = useState(initialItems);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bizum');
  const [radius, setRadius] = useState(25);
  const [processing, setProcessing] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const total = subtotal + 8500 + 1200;

  const updateQty = (id, delta) => {
    setItems(current => current.map(item =>
      item.id === id
        ? { ...item, qty: Math.max(0, item.qty + delta) }
        : item
    ));
  };

  const handlePayment = async () => {
    if (!termsAccepted || processing) return;
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1800));
    setProcessing(false);
    setView('confirmation');
  };

  const renderScreen = () => {
    if (view === 'cart') {
      return (
        <CartScreen items={items} subtotal={subtotal} total={total} updateQty={updateQty} onNext={() => setView('checkout')} />
      );
    }
    if (view === 'checkout') {
      return (
        <CheckoutScreen
          total={total}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          processing={processing}
          onPay={handlePayment}
          onBack={() => setView('cart')}
        />
      );
    }
    if (view === 'confirmation') {
      return <ConfirmationScreen onBack={() => setView('cart')} />;
    }
    if (view === 'messages') {
      return <MessagesScreen />;
    }
    if (view === 'logistics') {
      return <LogisticsScreen radius={radius} setRadius={setRadius} />;
    }
    return <ProfileScreen />;
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="fixed inset-x-0 top-0 z-40 bg-[#fdf9ef]/80 backdrop-blur-md border-b border-black/5">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-6">
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10" aria-label="Menú">
            <span className="material-symbols-outlined text-primary">menu</span>
          </button>
          <h1 className="font-headline text-2xl italic text-primary">Cosecha Editorial</h1>
          <div className="h-10 w-10 overflow-hidden rounded-full border border-black/5">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Perfil" className="h-full w-full object-cover" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 pb-32 pt-24">{renderScreen()}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-[#fdf9ef]/80 backdrop-blur-md shadow-[0_-4px_24px_rgba(28,28,22,0.06)]">
        <div className="mx-auto flex max-w-2xl items-center justify-around px-4 pb-6 pt-3">
          {navItems.map(item => {
            const active = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                className={[
                  'flex flex-col items-center justify-center py-2 transition-colors',
                  active ? 'rounded-full bg-primary px-4 text-on-primary' : 'text-[#1c1c16]/70 hover:text-primary'
                ].join(' ')}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function CartScreen({ items, subtotal, total, updateQty, onNext }) {
  return (
    <>
      <section className="mb-10">
        <h2 className="font-headline text-4xl italic text-primary">Mi Cesta</h2>
        <p className="mt-2 text-on-surface-variant">Cosechas reservadas directamente del huerto.</p>
      </section>

      <section className="mb-8 space-y-5">
        {items.map(item => (
          <article key={item.id} className="flex items-center gap-4 rounded-xl bg-surface-container-low p-4 shadow-soft">
            <div className="h-20 w-20 overflow-hidden rounded-lg">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-headline text-xl text-on-surface">{item.name}</h3>
              <p className="mb-2 text-sm text-on-surface-variant">{item.farm} • {item.qty > 1 ? 'Cantidad múltiple' : '1 unidad'}</p>
              <div className="flex items-center justify-between gap-4">
                <span className="text-lg font-bold text-primary">${item.price.toLocaleString('es-ES')}</span>
                <div className="flex items-center gap-3 rounded-full bg-surface-container-highest px-3 py-1 shadow-sm">
                  <button className="text-primary" onClick={() => updateQty(item.id, -1)} aria-label="Disminuir cantidad">
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="text-sm font-bold">{item.qty}</span>
                  <button className="text-primary" onClick={() => updateQty(item.id, 1)} aria-label="Aumentar cantidad">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mb-8 rounded-3xl bg-surface-container p-6 shadow-soft">
        <h3 className="mb-4 font-headline text-2xl text-on-surface">Resumen de Cosecha</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Subtotal productos</span>
            <span>${subtotal.toLocaleString('es-ES')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Logística de campo</span>
            <span>$8.500</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/20 pb-3">
            <span className="text-on-surface-variant">Tasa de sostenibilidad</span>
            <span>$1.200</span>
          </div>
          <div className="flex justify-between pt-3">
            <span className="font-bold">Total a pagar</span>
            <span className="font-headline text-2xl text-primary">${total.toLocaleString('es-ES')}</span>
          </div>
        </div>
      </section>

      <div className="pb-10">
        <button onClick={onNext} className="w-full rounded-xl bg-gradient-to-br from-primary to-primary-container py-4 text-lg font-bold text-on-primary shadow-lg">
          Ir a pagar
        </button>
      </div>
    </>
  );
}

function CheckoutScreen({ total, paymentMethod, setPaymentMethod, termsAccepted, setTermsAccepted, processing, onPay, onBack }) {
  return (
    <>
      <section className="mb-6">
        <button onClick={onBack} className="mb-5 flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10" aria-label="Volver">
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <span className="block text-[10px] uppercase tracking-[0.22em] font-bold text-primary">Paso Final</span>
        <h2 className="mt-2 font-headline text-4xl italic text-on-surface">Tu Cosecha Personal</h2>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-surface-container-low p-6 shadow-soft">
          <h3 className="mb-4 font-headline text-2xl text-primary">Resumen de Cesta</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-2"><span>Tomates</span><span>$18.500</span></div>
            <div className="flex justify-between gap-2"><span>Arúgula</span><span>$6.200</span></div>
            <div className="flex justify-between gap-2"><span>Huevos</span><span>$14.000</span></div>
          </div>
          <div className="mt-4 border-t border-outline-variant/20 pt-4">
            <div className="flex justify-between"><span>Total</span><span className="text-xl font-bold text-primary">${total.toLocaleString('es-ES')}</span></div>
          </div>
        </div>
        <div className="relative min-h-[200px] overflow-hidden rounded-3xl shadow-soft">
          <img src="https://images.unsplash.com/photo-1488459716781-a123dd36de6e?auto=format&fit=crop&w=800&q=80" alt="Cesta" className="h-full w-full object-cover" />
          <div className="absolute bottom-4 left-4 rounded-full bg-tertiary-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-on-primary">Cosecha Local</div>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-2xl text-on-surface">Dirección de entrega</h3>
          <button className="text-sm font-bold text-primary">Editar</button>
        </div>
        <div className="overflow-hidden rounded-3xl bg-surface-container shadow-soft">
          <div className="p-5">
            <p className="font-semibold text-on-surface">Calle de Serrano, 45, 3º Izquierda</p>
            <p className="mt-1 text-sm text-on-surface-variant">28001 Madrid, España</p>
          </div>
          <div className="relative h-36 bg-surface-container-highest">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" alt="Mapa" className="h-full w-full object-cover grayscale opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 animate-pulse">
                <span className="material-symbols-outlined text-primary">location_on</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        <h3 className="font-headline text-2xl text-on-surface">Método de pago</h3>
        <div className="space-y-3">
          {[
            { value: 'bizum', label: 'Bizum', sub: 'Transferencia instantánea', badge: 'bizum' },
            { value: 'apple', label: 'Apple Pay', sub: 'Rápido y seguro', badge: 'ios' },
            { value: 'card', label: 'Tarjeta de crédito', sub: 'Visa •••• 8821', badge: 'credit_card' }
          ].map(method => (
            <label key={method.value} className="flex cursor-pointer items-center justify-between rounded-2xl bg-surface-container-low p-5 shadow-sm hover:bg-surface-container-lowest">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                  {method.badge === 'bizum' && <span className="text-[10px] font-bold" style={{color:'#00AEC7'}}>bizum</span>}
                  {method.badge === 'ios' && <span className="material-symbols-outlined text-lg text-black">ios</span>}
                  {method.badge === 'credit_card' && <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>}
                </div>
                <div>
                  <span className="block font-medium text-on-surface">{method.label}</span>
                  <span className="text-xs text-on-surface-variant">{method.sub}</span>
                </div>
              </div>
              <input type="radio" name="payment-method" checked={paymentMethod === method.value} onChange={() => setPaymentMethod(method.value)} />
            </label>
          ))}
        </div>
      </section>

      <section className="mt-8 space-y-4">
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-surface-container-low p-4 shadow-sm">
          <input type="checkbox" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} className="h-5 w-5 accent-primary" />
          <span className="text-sm text-on-surface-variant">Acepto los <a href="#" className="font-semibold text-primary">términos</a> y la <a href="#" className="font-semibold text-primary">privacidad</a></span>
        </label>
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-surface-container-low p-4 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
          <span className="material-symbols-outlined text-base">lock</span>
          <span>Pago 100% seguro y encriptado</span>
        </div>
      </section>

      <div className="mt-8 rounded-2xl border-l-4 border-primary bg-primary/5 p-6">
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: 'FILL 1' }}>eco</span>
          <div>
            <h4 className="font-headline text-xl italic text-primary">Tu compra hace la diferencia</h4>
            <p className="mt-1 text-sm text-on-surface-variant">Apoyas a 2 familias agricultoras y reduces 2.3 kg CO₂ frente a la distribución convencional.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 pb-20">
        <button
          disabled={!termsAccepted || processing}
          onClick={onPay}
          className="flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-primary to-primary-container py-4 text-lg font-bold text-on-primary shadow-xl disabled:opacity-50"
        >
          <span className="material-symbols-outlined">verified_user</span>
          <span>{processing ? 'Procesando...' : `Confirmar y Pagar $${total.toLocaleString('es-ES')}`}</span>
        </button>
      </div>
    </>
  );
}

function ConfirmationScreen({ onBack }) {
  return (
    <>
      <section className="pt-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: 'FILL 1' }}>check_circle</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-primary">Pedido confirmado</span>
        <h2 className="mt-3 font-headline text-4xl italic text-primary">¡Gracias por tu compra!</h2>
        <p className="mt-3 text-on-surface-variant">Tu pedido está listo para ser recogido o enviado con cuidado desde el huerto.</p>
      </section>

      <section className="mt-8 rounded-3xl bg-surface-container-low p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Número de pedido</p>
            <h3 className="mt-1 font-headline text-2xl text-primary">#CE-2024-001234</h3>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Preparando</span>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span>Tomates</span><span>$18.500</span></div>
          <div className="flex justify-between"><span>Arúgula</span><span>$6.200</span></div>
          <div className="flex justify-between"><span>Huevos</span><span>$14.000</span></div>
        </div>
        <div className="mt-5 border-t border-outline-variant/20 pt-5">
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Total pagado</span>
            <span className="font-headline text-2xl text-primary">$48.400</span>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-surface-container p-6 shadow-soft">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
          </div>
          <div>
            <h3 className="font-headline text-2xl text-on-surface">Entrega estimada</h3>
            <p className="mt-2 text-sm text-on-surface-variant">Mañana entre las 09:00 y 12:00 h.</p>
            <p className="mt-1 text-sm text-on-surface-variant">Calle de Serrano, 45, 3º Izquierda · Madrid</p>
          </div>
        </div>
      </section>

      <div className="mt-8 space-y-3 pb-10">
        <button onClick={onBack} className="w-full rounded-3xl bg-gradient-to-br from-primary to-primary-container py-4 text-lg font-bold text-on-primary shadow-xl">Seguir comprando</button>
        <button className="w-full rounded-3xl border-2 border-primary bg-transparent py-4 text-lg font-bold text-primary">Ver detalles del pedido</button>
      </div>
    </>
  );
}

function MessagesScreen() {
  const chats = [
    { name: 'Mateo G.', role: 'Productor', title: '¿Te parece bien la entrega el jueves a las 9?', unread: 2, time: '12:45 PM' },
    { name: 'Elena Rivas', role: 'Compradora', title: 'El queso de cabra estaba exquisito, gracias por la recomendación.', time: 'Ayer' },
    { name: 'Carlos D.', role: 'Productor', title: 'Confirmado, las 2 cajas de higos frescos están listas para retiro.', time: 'Lunes' }
  ];

  return (
    <>
      <section className="mb-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.22em] font-bold text-primary">Correspondencia</span>
            <h2 className="font-headline text-4xl italic text-primary">Bandeja de entrada</h2>
          </div>
          <button className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-on-primary">Nuevo mensaje</button>
        </div>

        <div className="space-y-4">
          {chats.map((chat, idx) => (
            <div key={idx} className="flex items-center gap-4 rounded-xl bg-surface-container-low p-4 shadow-soft">
              <div className="h-14 w-14 overflow-hidden rounded-full">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" alt={chat.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-headline text-xl text-on-surface">{chat.name}</h3>
                    <span className="inline-block rounded-full bg-secondary-fixed px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-secondary">{chat.role}</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant">{chat.time}</span>
                </div>
                <p className="mt-2 truncate text-sm text-on-surface-variant">{chat.title}</p>
                {chat.unread && <span className="mt-2 inline-block rounded-full bg-primary-fixed px-2 py-1 text-[10px] font-bold text-primary">{chat.unread} nuevos</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function LogisticsScreen({ radius, setRadius }) {
  return (
    <>
      <section className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-primary">Gestión del Productor</span>
        <h2 className="mt-2 font-headline text-4xl text-primary">Configuración de Logística de Reparto</h2>
        <p className="mt-3 text-on-surface-variant">Define cómo llegarán tus productos frescos a los clientes.</p>
      </section>

      <div className="space-y-6">
        <div className="rounded-3xl bg-surface-container-low p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-headline text-2xl text-primary">Radio de entrega</h3>
            <div className="rounded-full bg-primary px-4 py-1 text-on-primary">
              <span className="font-bold">{radius}</span>
              <span className="ml-1 text-xs uppercase">KM</span>
            </div>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="h-2 w-full accent-primary"
          />
          <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            <span>5 km</span>
            <span>100 km</span>
          </div>
        </div>

        <div className="rounded-3xl bg-tertiary-fixed p-6 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-tertiary">eco</span>
            <div>
              <h4 className="font-headline text-xl italic text-tertiary">Recomendación para Frescura Óptima</h4>
              <p className="mt-2 text-sm text-on-tertiary-fixed-variant">Mantener un radio inferior a <span className="font-bold underline">30 km</span> reduce emisiones y garantiza la hidratación intacta.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-surface-container p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">map</span>
            <h3 className="font-headline text-2xl text-primary">Previsualización de Cobertura</h3>
          </div>
          <div className="relative h-52 overflow-hidden rounded-2xl bg-surface-container-highest">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80" alt="Mapa" className="h-full w-full object-cover opacity-50 grayscale" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10">
                <span className="material-symbols-outlined text-primary">location_on</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ProfileScreen() {
  return (
    <>
      <section className="mb-8 text-center">
        <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-primary/20">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" alt="Perfil" className="h-full w-full object-cover" />
        </div>
        <h2 className="font-headline text-4xl italic text-primary">Ana García</h2>
        <p className="mt-2 text-on-surface-variant">Productora • Suesca</p>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl bg-surface-container-low p-5 shadow-soft">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Pedidos</p>
          <p className="mt-2 font-headline text-3xl text-primary">128</p>
        </div>
        <div className="rounded-3xl bg-surface-container-low p-5 shadow-soft">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Clientes</p>
          <p className="mt-2 font-headline text-3xl text-primary">3.4k</p>
        </div>
      </section>

      <section className="mt-8 space-y-3 rounded-3xl bg-surface-container p-6 shadow-soft">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
          <span className="text-on-surface-variant">Correo</span>
          <span className="font-medium text-on-surface">ana@cosechaeditorial.com</span>
        </div>
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
          <span className="text-on-surface-variant">Teléfono</span>
          <span className="font-medium text-on-surface">+34 600 123 456</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Estado</span>
          <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Activo</span>
        </div>
      </section>
    </>
  );
}

export default App;
