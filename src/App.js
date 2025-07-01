import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Key,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Settings,
  LogOut,
  ArrowLeft,
  Send,
  Home,
  Utensils,
  CupSoda,
  Cake,
  AlertTriangle,
  Star,
  Pizza,
  Salad,
  Coffee,
  Sandwich,
  Sparkles,
  Loader2,
} from "lucide-react";

// --- Icon Mapping ---
// A helper to render Lucide icons from a string name.
const iconComponents = {
  Star: <Star />,
  Utensils: <Utensils />,
  Cake: <Cake />,
  CupSoda: <CupSoda />,
  Pizza: <Pizza />,
  Salad: <Salad />,
  Coffee: <Coffee />,
  Sandwich: <Sandwich />,
  Home: <Home />,
  Default: <Utensils />,
};
const IconComponent = ({ name, ...props }) => {
  const Icon = iconComponents[name] || iconComponents.Default;
  return React.cloneElement(Icon, props);
};
const availableIcons = Object.keys(iconComponents).filter(
  (key) => !["Home", "Default"].includes(key)
);

// --- Initial Data (used as fallback if localStorage is empty) ---
const INITIAL_PRODUCTS = [
  {
    id: "HB001",
    name: "Clásica Suprema",
    category: "Hamburguesas",
    price: 12.99,
    description:
      "Carne de res de 150g, queso cheddar, lechuga fresca, tomate, cebolla morada y nuestra salsa secreta.",
    imageUrl: "https://placehold.co/800x600/FBBF24/3F3F46?text=Hamburguesa",
  },
  {
    id: "HB002",
    name: "Doble Bacon BBQ",
    category: "Hamburguesas",
    price: 15.99,
    description:
      "Doble carne de 120g, doble queso americano, tiras de bacon crujiente, aros de cebolla y salsa BBQ.",
    imageUrl: "https://placehold.co/800x600/F59E0B/3F3F46?text=Hamburguesa+BBQ",
  },
  {
    id: "BE001",
    name: "Malteada de Vainilla",
    category: "Bebidas",
    price: 6.0,
    description:
      "Clásica y cremosa malteada preparada con helado de vainilla premium.",
    imageUrl: "https://placehold.co/800x600/A78BFA/3F3F46?text=Malteada",
  },
];

const INITIAL_SETTINGS = {
  businessName: "Mi Negocio",
  logoUrl: "https://placehold.co/200x80/14B8A6/FFFFFF?text=Mi+Logo",
  slogan: "Sabor que inspira momentos.",
  whatsappNumber: "1234567890",
};

const INITIAL_BANNERS = [
  {
    id: "PROMO-1687530000",
    title: "¡Combo del Día!",
    subtitle: "Hamburguesa Clásica + Papas + Bebida por solo $18.99",
    imageUrl:
      "https://placehold.co/1200x400/38B2AC/FFFFFF?text=Promo+del+D%C3%ADa",
    isPromotion: true,
    price: 18.99,
    description:
      "Aprovecha nuestra oferta especial: Hamburguesa Clásica, papas fritas y una bebida refrescante a un precio increíble.",
  },
];

const INITIAL_CATEGORIES = [
  { id: "cat-promo", name: "Promociones", icon: "Star" },
  { id: "cat-hamburguesas", name: "Hamburguesas", icon: "Utensils" },
  { id: "cat-bebidas", name: "Bebidas", icon: "CupSoda" },
  { id: "cat-postres", name: "Postres", icon: "Cake" },
];

// --- Custom Alert Component ---
const CustomAlert = ({ message, type, onClose }) => {
  if (!message) return null;
  const baseStyle =
    "fixed top-5 right-5 p-4 rounded-lg shadow-xl text-white flex items-center z-[100] animate-fade-in-right";
  const typeStyles = {
    success: "bg-teal-500",
    error: "bg-rose-500",
    info: "bg-blue-500",
  };
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);
  return (
    <div className={`${baseStyle} ${typeStyles[type]}`}>
      <span className="flex-grow">{message}</span>
      <button onClick={onClose} className="ml-4 font-bold">
        <X size={18} />
      </button>
    </div>
  );
};

// --- Background component ---
const SubtleBackground = () => (
  <div
    className="fixed top-0 left-0 w-full h-full -z-10 opacity-5"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }}
  ></div>
);

// --- Generic Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-transform duration-300 scale-95 animate-fade-in-up">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-rose-500 transition-colors"
          >
            <X size={28} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// --- Shopping Cart ---
const ShoppingCartPanel = ({
  cart,
  setCart,
  settings,
  setView,
  clearCart,
  setAlertInfo,
}) => {
  const [customerAddress, setCustomerAddress] = useState("");
  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };
  const updateQuantity = (productId, delta) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };
  const handleNoteChange = (productId, note) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, note } : item
      )
    );
  };
  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const generateOrderMessage = () => {
    if (!customerAddress.trim()) {
      setAlertInfo({
        message: "Por favor, ingresa tu dirección para la entrega.",
        type: "error",
      });
      return;
    }
    const folio = `PEDIDO-${Date.now()}`;
    let message = `*¡Nuevo Pedido!* (${folio})\n\nHola, me gustaría ordenar lo siguiente:\n\n`;
    cart.forEach((item) => {
      message += `*${item.name}*\n_Cantidad:_ ${item.quantity}\n`;
      if (item.note) message += `_Modificación:_ ${item.note}\n`;
      message += `_Precio:_ $${item.price.toFixed(2)}\n_Subtotal:_ $${(
        item.price * item.quantity
      ).toFixed(2)}\n\n`;
    });
    message += `--------------------------------------\n*Total del Pedido: $${total.toFixed(
      2
    )}*\n\n*Dirección de Entrega:*\n${customerAddress}\n\n¡Gracias!`;
    const whatsappUrl = `https://wa.me/${
      settings.whatsappNumber
    }?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    clearCart();
    setView("home");
    setAlertInfo({
      message: "¡Pedido enviado! Redirigiendo a WhatsApp...",
      type: "success",
    });
  };

  if (cart.length === 0) {
    return (
      <div className="text-center p-10">
        <ShoppingCart size={60} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-700">
          Tu carrito está vacío
        </h3>
        <p className="text-gray-500 mt-2">Añade productos para verlos aquí.</p>
        <button
          onClick={() => setView("home")}
          className="mt-6 bg-teal-500 text-white font-bold py-3 px-6 rounded-full hover:bg-teal-600 transition-all shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="inline mr-2" /> Volver al menú
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center">
        <ShoppingCart className="mr-3 text-teal-500" /> Mi Pedido
      </h2>
      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover mr-4"
              />
              <div className="flex-grow">
                <h4 className="font-bold text-gray-800">{item.name}</h4>
                <p className="text-sm text-teal-500 font-semibold">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="bg-gray-200 text-gray-700 rounded-full w-8 h-8 font-bold hover:bg-gray-300"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="bg-gray-200 text-gray-700 rounded-full w-8 h-8 font-bold hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-4 text-gray-400 hover:text-rose-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder="Añadir modificaciones (ej: sin queso)"
                value={item.note || ""}
                onChange={(e) => handleNoteChange(item.id, e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-100 p-6 rounded-xl mt-6">
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-bold text-gray-700 mb-2"
          >
            Dirección de Entrega
          </label>
          <textarea
            id="address"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            placeholder="Ej: Calle Ficticia 123, Colonia Centro. Apto 4B. Referencia: portón negro."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            rows="3"
          ></textarea>
        </div>
        <div className="flex justify-between items-center text-xl font-bold text-gray-800 mb-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={generateOrderMessage}
          disabled={!customerAddress.trim()}
          className="w-full bg-green-500 text-white font-bold py-4 px-6 rounded-full hover:bg-green-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Send className="inline mr-3" /> Realizar Pedido por WhatsApp
        </button>
      </div>
    </div>
  );
};

// --- Administration Panel ---
const AdminPanel = ({
  products,
  setProducts,
  settings,
  setSettings,
  banners,
  setBanners,
  categories,
  setCategories,
  setAlertInfo,
  setView,
  setLoggedIn,
}) => {
  const [currentAdminView, setCurrentAdminView] = useState("products");

  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: categories[1]?.name || "",
    imageUrl: "",
  });

  const [settingsForm, setSettingsForm] = useState(settings);

  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    id: "",
    title: "",
    subtitle: "",
    imageUrl: "",
    isPromotion: false,
    price: 0,
    description: "",
  });

  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    name: "",
    icon: "Utensils",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);

  useEffect(() => {
    if (editingProduct) setProductForm(editingProduct);
    else
      setProductForm({
        id: "",
        name: "",
        description: "",
        price: "",
        category: categories.find((c) => c.name !== "Promociones")?.name || "",
        imageUrl: "",
      });
  }, [editingProduct, categories]);
  useEffect(() => {
    if (editingBanner) setBannerForm(editingBanner);
    else
      setBannerForm({
        id: "",
        title: "",
        subtitle: "",
        imageUrl: "",
        isPromotion: false,
        price: 0,
        description: "",
      });
  }, [editingBanner]);
  useEffect(() => {
    if (editingCategory) setCategoryForm(editingCategory);
    else setCategoryForm({ id: "", name: "", icon: "Utensils" });
  }, [editingCategory]);
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const handleFormChange = (setter) => (e) => {
    const { name, value, type, checked } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e, handler, item, setItem) => {
    e.preventDefault();
    handler(item);
    setItem(null);
  };

  const handleProductSubmit = () => {
    const productData = {
      ...productForm,
      price: parseFloat(productForm.price) || 0,
    };
    if (editingProduct) {
      setProducts(
        products.map((p) => (p.id === editingProduct.id ? productData : p))
      );
      setAlertInfo({ message: "Producto actualizado.", type: "success" });
    } else {
      setProducts([{ ...productData, id: `PROD-${Date.now()}` }, ...products]);
      setAlertInfo({ message: "Producto añadido.", type: "success" });
    }
  };

  const handleBannerSubmit = () => {
    const bannerData = {
      ...bannerForm,
      price: parseFloat(bannerForm.price) || 0,
    };
    if (editingBanner) {
      setBanners(
        banners.map((b) => (b.id === editingBanner.id ? bannerData : b))
      );
      setAlertInfo({ message: "Banner actualizado.", type: "success" });
    } else {
      setBanners([...banners, { ...bannerData, id: `PROMO-${Date.now()}` }]);
      setAlertInfo({ message: "Banner añadido.", type: "success" });
    }
  };

  const handleCategorySubmit = () => {
    if (
      categories.some(
        (c) =>
          c.name.toLowerCase() === categoryForm.name.toLowerCase() &&
          c.id !== categoryForm.id
      )
    ) {
      setAlertInfo({
        message: "Ya existe una categoría con ese nombre.",
        type: "error",
      });
      return;
    }
    if (editingCategory) {
      setCategories(
        categories.map((c) => (c.id === editingCategory.id ? categoryForm : c))
      );
      setAlertInfo({ message: "Categoría actualizada.", type: "success" });
    } else {
      setCategories([
        ...categories,
        { ...categoryForm, id: `cat-${Date.now()}` },
      ]);
      setAlertInfo({ message: "Categoría añadida.", type: "success" });
    }
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    setSettings(settingsForm);
    setAlertInfo({ message: "Ajustes guardados.", type: "success" });
  };

  const confirmDelete = (item, type) => {
    if (type === "product") setProductToDelete(item);
    if (type === "banner") setBannerToDelete(item);
    if (type === "category") {
      if (item.name === "Promociones") {
        setAlertInfo({
          message: "No se puede eliminar la categoría de promociones.",
          type: "error",
        });
        return;
      }
      if (products.some((p) => p.category === item.name)) {
        setAlertInfo({
          message: "No se puede eliminar. Hay productos en esta categoría.",
          type: "error",
        });
        return;
      }
      setCategoryToDelete(item);
    }
  };
  const executeDelete = () => {
    if (productToDelete)
      setProducts(products.filter((p) => p.id !== productToDelete.id));
    if (bannerToDelete)
      setBanners(banners.filter((b) => b.id !== bannerToDelete.id));
    if (categoryToDelete)
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
    setAlertInfo({ message: `Elemento eliminado.`, type: "info" });
    setProductToDelete(null);
    setBannerToDelete(null);
    setCategoryToDelete(null);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setView("home");
  };

  // --- Gemini API Call ---
  const callGeminiAPI = async (prompt, schema = null) => {
    setIsGenerating(true);
    setAlertInfo({ message: "✨ Generando con IA...", type: "info" });
    const apiKey = ""; // Leave empty, handled by environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      ...(schema && {
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      }),
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setAlertInfo({ message: "¡Sugerencia generada!", type: "success" });
        return text;
      } else {
        throw new Error("No content received from Gemini.");
      }
    } catch (error) {
      console.error("Gemini API call failed:", error);
      setAlertInfo({ message: `Error de IA: ${error.message}`, type: "error" });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDescription = async () => {
    if (!productForm.name) {
      setAlertInfo({
        message: "Por favor, ingresa un nombre de producto primero.",
        type: "error",
      });
      return;
    }
    const prompt = `Eres un experto en marketing gastronómico. Crea una descripción de menú atractiva y concisa (máximo 25 palabras) para un producto llamado "${productForm.name}" que pertenece a la categoría "${productForm.category}". Usa un tono apetitoso y descriptivo.`;
    const generatedText = await callGeminiAPI(prompt);
    if (generatedText) {
      setProductForm((prev) => ({ ...prev, description: generatedText }));
    }
  };

  const generateSlogan = async () => {
    if (!settingsForm.businessName) {
      setAlertInfo({
        message: "Por favor, ingresa el nombre de tu negocio.",
        type: "error",
      });
      return;
    }
    const prompt = `Eres un experto en branding. Genera 3 eslóganes cortos y memorables para un restaurante llamado "${settingsForm.businessName}". Devuelve solo los eslóganes, cada uno en una nueva línea.`;
    const generatedText = await callGeminiAPI(prompt);
    if (generatedText) {
      setAiSuggestion({
        title: "Sugerencias de Eslogan",
        content: generatedText.split("\n").filter((s) => s),
      });
      setIsSuggestionModalOpen(true);
    }
  };

  const generatePromotion = async () => {
    const productList = products
      .map((p) => `${p.name} ($${p.price})`)
      .join(", ");
    const prompt = `Eres un gerente de restaurante creativo. Basado en la siguiente lista de productos: ${productList}, diseña una promoción atractiva. Proporciona un título, un subtítulo, una descripción detallada y un precio sugerido para la promoción.`;
    const schema = {
      type: "OBJECT",
      properties: {
        title: {
          type: "STRING",
          description: "Título principal de la promoción (ej: Combo Amigos).",
        },
        subtitle: {
          type: "STRING",
          description:
            "Subtítulo corto y pegadizo (ej: 2 Hamburguesas + Papas Grandes).",
        },
        description: {
          type: "STRING",
          description: "Descripción detallada de lo que incluye la promoción.",
        },
        price: {
          type: "NUMBER",
          description: "Un precio atractivo y redondeado para la promoción.",
        },
      },
      required: ["title", "subtitle", "description", "price"],
    };
    const generatedJson = await callGeminiAPI(prompt, schema);
    if (generatedJson) {
      try {
        const suggestion = JSON.parse(generatedJson);
        setAiSuggestion({
          title: "Idea para Promoción",
          content: suggestion,
          isPromo: true,
        });
        setIsSuggestionModalOpen(true);
      } catch (e) {
        setAlertInfo({
          message: "Error al procesar la sugerencia de IA.",
          type: "error",
        });
      }
    }
  };

  return (
    <>
      <Modal
        isOpen={!!productToDelete || !!bannerToDelete || !!categoryToDelete}
        onClose={() => {
          setProductToDelete(null);
          setBannerToDelete(null);
          setCategoryToDelete(null);
        }}
        title="Confirmar Eliminación"
      >
        <div className="text-center">
          <AlertTriangle size={48} className="text-rose-500 mx-auto mb-4" />
          <p className="text-lg text-gray-700 mb-2">
            ¿Estás seguro de que quieres eliminar este elemento?
          </p>
          <p className="font-bold text-xl text-gray-800 mb-6">
            "
            {productToDelete?.name ||
              bannerToDelete?.title ||
              categoryToDelete?.name}
            "
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setProductToDelete(null);
                setBannerToDelete(null);
                setCategoryToDelete(null);
              }}
              className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              onClick={executeDelete}
              className="py-2 px-6 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition"
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isSuggestionModalOpen}
        onClose={() => setIsSuggestionModalOpen(false)}
        title={aiSuggestion?.title || "Sugerencia de IA"}
      >
        {aiSuggestion?.isPromo ? (
          <div className="space-y-4 text-left">
            <div>
              <strong className="text-gray-700">Título:</strong>
              <p className="p-2 bg-gray-100 rounded-md mt-1">
                {aiSuggestion.content.title}
              </p>
            </div>
            <div>
              <strong className="text-gray-700">Subtítulo:</strong>
              <p className="p-2 bg-gray-100 rounded-md mt-1">
                {aiSuggestion.content.subtitle}
              </p>
            </div>
            <div>
              <strong className="text-gray-700">Descripción:</strong>
              <p className="p-2 bg-gray-100 rounded-md mt-1">
                {aiSuggestion.content.description}
              </p>
            </div>
            <div>
              <strong className="text-gray-700">Precio Sugerido:</strong>
              <p className="p-2 bg-gray-100 rounded-md mt-1">
                ${aiSuggestion.content.price?.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => {
                setBannerForm({
                  title: aiSuggestion.content.title,
                  subtitle: aiSuggestion.content.subtitle,
                  description: aiSuggestion.content.description,
                  price: aiSuggestion.content.price,
                  isPromotion: true,
                  imageUrl: "",
                });
                setCurrentAdminView("banners");
                setEditingBanner(null);
                setIsSuggestionModalOpen(false);
                setAlertInfo({
                  message: "Datos de promoción cargados en el formulario.",
                  type: "info",
                });
              }}
              className="w-full mt-4 bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition"
            >
              Usar esta promoción
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {aiSuggestion?.content.map((s, i) => (
              <li key={i} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                {s}
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-4xl font-extrabold text-gray-800">
              Panel de Administración
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setView("home")}
                className="flex items-center gap-2 bg-white text-gray-700 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition"
              >
                <Home size={18} /> Ver Tienda
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-rose-500 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-rose-600 transition"
              >
                <LogOut size={18} /> Cerrar Sesión
              </button>
            </div>
          </div>

          <div className="flex flex-wrap border-b border-gray-300 mb-6">
            <button
              onClick={() => setCurrentAdminView("products")}
              className={`py-3 px-5 font-semibold transition ${
                currentAdminView === "products"
                  ? "border-b-2 border-teal-500 text-teal-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Productos
            </button>
            <button
              onClick={() => setCurrentAdminView("categories")}
              className={`py-3 px-5 font-semibold transition ${
                currentAdminView === "categories"
                  ? "border-b-2 border-teal-500 text-teal-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Categorías
            </button>
            <button
              onClick={() => setCurrentAdminView("banners")}
              className={`py-3 px-5 font-semibold transition ${
                currentAdminView === "banners"
                  ? "border-b-2 border-teal-500 text-teal-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Banners
            </button>
            <button
              onClick={() => setCurrentAdminView("settings")}
              className={`py-3 px-5 font-semibold transition ${
                currentAdminView === "settings"
                  ? "border-b-2 border-teal-500 text-teal-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Ajustes
            </button>
          </div>

          {currentAdminView === "products" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-lg sticky top-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    {editingProduct ? (
                      <Edit className="mr-2 text-teal-500" />
                    ) : (
                      <Plus className="mr-2 text-teal-500" />
                    )}
                    {editingProduct ? "Editar Producto" : "Añadir Producto"}
                  </h3>
                  <form
                    onSubmit={(e) =>
                      handleSubmit(
                        e,
                        handleProductSubmit,
                        productForm,
                        setEditingProduct
                      )
                    }
                    className="space-y-4"
                  >
                    <input
                      name="name"
                      type="text"
                      placeholder="Nombre del producto"
                      value={productForm.name}
                      onChange={handleFormChange(setProductForm)}
                      required
                      className="w-full p-3 border rounded-lg"
                    />
                    <div>
                      <textarea
                        name="description"
                        placeholder="Descripción"
                        value={productForm.description}
                        onChange={handleFormChange(setProductForm)}
                        required
                        className="w-full p-3 border rounded-lg"
                        rows="3"
                      ></textarea>
                      <button
                        type="button"
                        onClick={generateDescription}
                        disabled={isGenerating}
                        className="mt-2 w-full flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition shadow disabled:opacity-50 disabled:cursor-wait"
                      >
                        {isGenerating ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Sparkles size={18} />
                        )}
                        ✨ Generar Descripción
                      </button>
                    </div>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="Precio (ej: 12.99)"
                      value={productForm.price}
                      onChange={handleFormChange(setProductForm)}
                      required
                      className="w-full p-3 border rounded-lg"
                    />
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleFormChange(setProductForm)}
                      required
                      className="w-full p-3 border rounded-lg bg-white"
                    >
                      {categories
                        .filter((c) => c.name !== "Promociones")
                        .map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                    <input
                      name="imageUrl"
                      type="text"
                      placeholder="URL de la imagen"
                      value={productForm.imageUrl}
                      onChange={handleFormChange(setProductForm)}
                      required
                      className="w-full p-3 border rounded-lg"
                    />
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition shadow-sm flex items-center justify-center"
                      >
                        <Save className="mr-2" />{" "}
                        {editingProduct ? "Guardar" : "Añadir"}
                      </button>
                      {editingProduct && (
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                        >
                          <X className="mr-2" /> Cancelar
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4 transition-shadow hover:shadow-lg"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="flex-grow">
                      <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                        {p.category}
                      </span>
                      <h4 className="text-lg font-bold mt-1 text-gray-800">
                        {p.name}
                      </h4>
                      <p className="font-extrabold text-teal-500 text-lg">
                        ${p.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="bg-blue-100 text-blue-600 p-3 rounded-full hover:bg-blue-200 transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => confirmDelete(p, "product")}
                        className="bg-rose-100 text-rose-600 p-3 rounded-full hover:bg-rose-200 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentAdminView === "categories" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-lg sticky top-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    {editingCategory ? (
                      <Edit className="mr-2 text-teal-500" />
                    ) : (
                      <Plus className="mr-2 text-teal-500" />
                    )}
                    {editingCategory ? "Editar Categoría" : "Añadir Categoría"}
                  </h3>
                  <form
                    onSubmit={(e) =>
                      handleSubmit(
                        e,
                        handleCategorySubmit,
                        categoryForm,
                        setEditingCategory
                      )
                    }
                    className="space-y-4"
                  >
                    <input
                      name="name"
                      type="text"
                      placeholder="Nombre de la categoría"
                      value={categoryForm.name}
                      onChange={handleFormChange(setCategoryForm)}
                      required
                      className="w-full p-3 border rounded-lg"
                    />
                    <select
                      name="icon"
                      value={categoryForm.icon}
                      onChange={handleFormChange(setCategoryForm)}
                      required
                      className="w-full p-3 border rounded-lg bg-white"
                    >
                      {availableIcons.map((iconName) => (
                        <option key={iconName} value={iconName}>
                          {iconName}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition shadow-sm flex items-center justify-center"
                      >
                        <Save className="mr-2" />{" "}
                        {editingCategory ? "Guardar" : "Añadir"}
                      </button>
                      {editingCategory && (
                        <button
                          type="button"
                          onClick={() => setEditingCategory(null)}
                          className="bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                        >
                          <X className="mr-2" /> Cancelar
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4 transition-shadow hover:shadow-lg"
                  >
                    <IconComponent
                      name={c.icon}
                      size={24}
                      className="text-teal-500"
                    />
                    <div className="flex-grow">
                      <h4 className="text-lg font-bold text-gray-800">
                        {c.name}
                      </h4>
                    </div>
                    {c.name !== "Promociones" && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => setEditingCategory(c)}
                          className="bg-blue-100 text-blue-600 p-3 rounded-full hover:bg-blue-200 transition"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(c, "category")}
                          className="bg-rose-100 text-rose-600 p-3 rounded-full hover:bg-rose-200 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentAdminView === "banners" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-lg sticky top-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold flex items-center">
                      {editingBanner ? (
                        <Edit className="mr-2 text-teal-500" />
                      ) : (
                        <Plus className="mr-2 text-teal-500" />
                      )}
                      {editingBanner ? "Editar Promo" : "Añadir Promo"}
                    </h3>
                    <button
                      onClick={generatePromotion}
                      disabled={isGenerating}
                      className="flex items-center gap-2 text-sm bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-2 px-3 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition shadow disabled:opacity-50 disabled:cursor-wait"
                    >
                      {isGenerating ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Sparkles size={16} />
                      )}{" "}
                      ✨ Sugerir
                    </button>
                  </div>
                  <form
                    onSubmit={(e) =>
                      handleSubmit(
                        e,
                        handleBannerSubmit,
                        bannerForm,
                        setEditingBanner
                      )
                    }
                    className="space-y-4"
                  >
                    <input
                      name="title"
                      type="text"
                      placeholder="Título principal"
                      value={bannerForm.title}
                      onChange={handleFormChange(setBannerForm)}
                      required
                      className="w-full p-3 border rounded-lg"
                    />
                    <input
                      name="subtitle"
                      type="text"
                      placeholder="Subtítulo (texto corto)"
                      value={bannerForm.subtitle}
                      onChange={handleFormChange(setBannerForm)}
                      required
                      className="w-full p-3 border rounded-lg"
                    />
                    <input
                      name="imageUrl"
                      type="text"
                      placeholder="URL de la imagen"
                      value={bannerForm.imageUrl}
                      onChange={handleFormChange(setBannerForm)}
                      required
                      className="w-full p-3 border rounded-lg"
                    />
                    <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isPromotion"
                          checked={bannerForm.isPromotion}
                          onChange={handleFormChange(setBannerForm)}
                          className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />{" "}
                        <span className="font-bold text-teal-800">
                          Hacer esta promoción comprable
                        </span>
                      </label>
                      {bannerForm.isPromotion && (
                        <div className="mt-4 space-y-4 animate-fade-in">
                          <textarea
                            name="description"
                            placeholder="Descripción detallada de la promoción"
                            value={bannerForm.description}
                            onChange={handleFormChange(setBannerForm)}
                            required
                            className="w-full p-3 border rounded-lg"
                            rows="3"
                          ></textarea>
                          <input
                            name="price"
                            type="number"
                            step="0.01"
                            placeholder="Precio de la promo (ej: 18.99)"
                            value={bannerForm.price}
                            onChange={handleFormChange(setBannerForm)}
                            required
                            className="w-full p-3 border rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition shadow-sm flex items-center justify-center"
                      >
                        <Save className="mr-2" />{" "}
                        {editingBanner ? "Guardar" : "Añadir"}
                      </button>
                      {editingBanner && (
                        <button
                          type="button"
                          onClick={() => setEditingBanner(null)}
                          className="bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                        >
                          <X className="mr-2" /> Cancelar
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                {banners.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white p-4 rounded-xl shadow-md flex items-start gap-4 transition-shadow hover:shadow-lg"
                  >
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      className="w-32 h-20 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="flex-grow">
                      <h4 className="text-lg font-bold text-gray-800">
                        {b.title}
                      </h4>
                      <p className="text-sm text-gray-500">{b.subtitle}</p>
                      {b.isPromotion && (
                        <span className="mt-2 inline-block text-xs font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                          ${b.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => setEditingBanner(b)}
                        className="bg-blue-100 text-blue-600 p-3 rounded-full hover:bg-blue-200 transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => confirmDelete(b, "banner")}
                        className="bg-rose-100 text-rose-600 p-3 rounded-full hover:bg-rose-200 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentAdminView === "settings" && (
            <div className="animate-fade-in">
              <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Settings className="mr-3 text-teal-500" />
                  Ajustes Generales
                </h3>
                <form onSubmit={handleSettingsSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="businessName"
                      className="block text-sm font-bold text-gray-700 mb-1"
                    >
                      Nombre del Negocio
                    </label>
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      value={settingsForm.businessName}
                      onChange={handleFormChange(setSettingsForm)}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="slogan"
                      className="block text-sm font-bold text-gray-700 mb-1"
                    >
                      Eslogan de la Empresa
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="slogan"
                        name="slogan"
                        type="text"
                        value={settingsForm.slogan}
                        onChange={handleFormChange(setSettingsForm)}
                        className="w-full p-3 border rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={generateSlogan}
                        disabled={isGenerating}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition shadow disabled:opacity-50 disabled:cursor-wait"
                      >
                        {isGenerating ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Sparkles size={18} />
                        )}{" "}
                        ✨ Sugerir
                      </button>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="logoUrl"
                      className="block text-sm font-bold text-gray-700 mb-1"
                    >
                      URL del Logo
                    </label>
                    <input
                      id="logoUrl"
                      name="logoUrl"
                      type="text"
                      value={settingsForm.logoUrl}
                      onChange={handleFormChange(setSettingsForm)}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="whatsappNumber"
                      className="block text-sm font-bold text-gray-700 mb-1"
                    >
                      Número de WhatsApp (con código de país, sin +)
                    </label>
                    <input
                      id="whatsappNumber"
                      name="whatsappNumber"
                      type="tel"
                      value={settingsForm.whatsappNumber}
                      onChange={handleFormChange(setSettingsForm)}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition shadow-sm flex items-center justify-center"
                  >
                    <Save className="mr-2" /> Guardar Ajustes
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// --- Login Page ---
const LoginPage = ({ setLoggedIn, setView }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "merida13" && password === "darwin13") {
      setLoggedIn(true);
      setView("admin");
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Acceso de Administrador
          </h1>
          <p className="text-gray-500 mt-2">Ingresa tus credenciales</p>
        </div>
        {error && (
          <p className="bg-rose-100 text-rose-600 text-center p-3 rounded-lg">
            {error}
          </p>
        )}
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition"
              required
            />
          </div>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-bold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors shadow-md hover:shadow-lg"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main Page (Public) ---
const HomePage = ({
  products,
  settings,
  banners,
  categories,
  addToCart,
  setView,
  cart,
  setAlertInfo,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setTimeout(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentBanner, banners.length]);

  const allDisplayItems = useMemo(() => {
    const promotionsAsProducts = banners
      .filter((b) => b.isPromotion && b.price > 0)
      .map((p) => ({ ...p, name: p.title, category: "Promociones" }));
    return [...promotionsAsProducts, ...products];
  }, [products, banners]);

  const filteredItems = useMemo(
    () =>
      allDisplayItems.filter(
        (p) =>
          (selectedCategory === "Todos" || p.category === selectedCategory) &&
          (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.description &&
              p.description.toLowerCase().includes(searchTerm.toLowerCase())))
      ),
    [allDisplayItems, selectedCategory, searchTerm]
  );

  const displayCategories = useMemo(() => {
    const itemCategories = new Set(allDisplayItems.map((p) => p.category));
    const activeCategories = categories.filter((c) =>
      itemCategories.has(c.name)
    );
    return [{ id: "all", name: "Todos", icon: "Home" }, ...activeCategories];
  }, [allDisplayItems, categories]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAlertInfo({
      message: `${product.name} añadido al carrito!`,
      type: "success",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => setView("home")}
          >
            <img
              src={settings.logoUrl}
              alt="Logo"
              className="h-12 md:h-16 w-auto bg-gray-200 rounded"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                {settings.businessName}
              </h1>
              <p className="text-xs md:text-sm text-gray-500 hidden sm:block">
                {settings.slogan}
              </p>
            </div>
          </div>
          <div className="flex-1 max-w-xs mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar delicias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100 border border-transparent rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-teal-400 focus:bg-white transition"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView("cart")}
              className="relative text-gray-600 hover:text-teal-500 transition-colors"
            >
              <ShoppingCart size={28} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
            <button
              onClick={() => setView("login")}
              className="text-gray-600 hover:text-teal-500 transition-colors"
            >
              <User size={26} />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        {banners.length > 0 && (
          <div className="relative w-full h-56 md:h-80 rounded-2xl overflow-hidden shadow-lg my-6 bg-gray-200">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentBanner ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white p-4">
                  <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg animate-fade-in-down">
                    {banner.title}
                  </h2>
                  <p className="mt-2 md:text-xl drop-shadow-md animate-fade-in-up">
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex items-center gap-3 sm:gap-4 whitespace-nowrap md:justify-center">
            {displayCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 flex items-center flex-shrink-0 ${
                  selectedCategory === cat.name
                    ? "bg-teal-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-teal-100 hover:text-teal-600"
                }`}
              >
                <IconComponent name={cat.icon} size={20} className="mr-2" />{" "}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="overflow-hidden h-48 bg-gray-100">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-sm mt-1 flex-grow">
                  {item.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-2xl font-extrabold text-teal-500">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-gray-800 text-white rounded-full p-3 hover:bg-teal-500 transition-colors shadow-sm group-hover:shadow-lg"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-16">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-600">
                No se encontraron productos
              </h3>
              <p className="text-gray-500 mt-2">
                Intenta con otra búsqueda o categoría.
              </p>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-white mt-12 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} {settings.businessName}. Todos los
            derechos reservados.
          </p>
          <div className="mt-2 text-sm">
            <a href="#" className="hover:text-teal-500 transition">
              Aviso Legal
            </a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-teal-500 transition">
              Políticas de Privacidad
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Main Component ---
const App = () => {
  const getFromLocalStorage = (key, fallback) => {
    try {
      const storedItem = localStorage.getItem(key);
      return storedItem ? JSON.parse(storedItem) : fallback;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage`, error);
      return fallback;
    }
  };

  const [products, setProducts] = useState(() =>
    getFromLocalStorage("my-products", INITIAL_PRODUCTS)
  );
  const [settings, setSettings] = useState(() =>
    getFromLocalStorage("my-settings", INITIAL_SETTINGS)
  );
  const [banners, setBanners] = useState(() =>
    getFromLocalStorage("my-banners", INITIAL_BANNERS)
  );
  const [categories, setCategories] = useState(() =>
    getFromLocalStorage("my-categories", INITIAL_CATEGORIES)
  );

  const [cart, setCart] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState("home");
  const [alertInfo, setAlertInfo] = useState({ message: "", type: "success" });

  useEffect(() => {
    localStorage.setItem("my-products", JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem("my-settings", JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem("my-banners", JSON.stringify(banners));
  }, [banners]);
  useEffect(() => {
    localStorage.setItem("my-categories", JSON.stringify(categories));
  }, [categories]);

  const handleSetAlert = (info) => {
    setAlertInfo(info);
  };
  const handleCloseAlert = useCallback(() => {
    setAlertInfo({ message: "", type: "success" });
  }, []);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id && !item.note
      );
      if (existingItem)
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      return [...currentCart, { ...product, quantity: 1, note: "" }];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const renderView = () => {
    switch (view) {
      case "admin":
        return loggedIn ? (
          <AdminPanel
            {...{
              products,
              setProducts,
              settings,
              setSettings,
              banners,
              setBanners,
              categories,
              setCategories,
              setAlertInfo,
              setView,
              setLoggedIn,
            }}
          />
        ) : (
          <LoginPage setLoggedIn={setLoggedIn} setView={setView} />
        );
      case "login":
        return <LoginPage setLoggedIn={setLoggedIn} setView={setView} />;
      case "cart":
        return (
          <>
            <header className="bg-white shadow-sm">
              <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => setView("home")}
                >
                  <img
                    src={settings.logoUrl}
                    alt="Logo"
                    className="h-12 md:h-16 w-auto bg-gray-200 rounded"
                  />
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    {settings.businessName}
                  </h1>
                </div>
                <button
                  onClick={() => setView("home")}
                  className="flex items-center gap-2 bg-teal-500 text-white font-bold py-2 px-4 rounded-full hover:bg-teal-600 transition"
                >
                  <ArrowLeft size={18} /> Volver
                </button>
              </div>
            </header>
            <ShoppingCartPanel
              {...{ cart, setCart, settings, setView, clearCart, setAlertInfo }}
            />
          </>
        );
      case "home":
      default:
        return (
          <HomePage
            {...{
              products,
              settings,
              banners,
              categories,
              addToCart,
              setView,
              cart,
              setAlertInfo,
            }}
          />
        );
    }
  };

  return (
    <>
      <SubtleBackground />
      <CustomAlert
        message={alertInfo.message}
        type={alertInfo.type}
        onClose={handleCloseAlert}
      />
      <div className="font-sans antialiased text-gray-800">{renderView()}</div>
    </>
  );
};

export default App;
