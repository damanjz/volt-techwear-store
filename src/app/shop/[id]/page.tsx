"use client";

import { useStore } from "@/lib/store";
import { useToastStore } from "@/components/TerminalToast";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";

// Mock database mapping for PDPs
const MOCK_DB: Record<string, any> = {
  "tx-01": { id: "tx-01", name: "Aegis Utility Jacket // V2", price: 345.0, category: "Outerwear", imageUrl: "/products/tx-01.png", description: "Engineered from high-density ballistic nylon with a DWR finish. The Aegis V2 features 8 modular magnetic-snap pockets, an articulated hood, and an internalized harness system for rapid deployment." },
  "px-04": { id: "px-04", name: "Carbon Parachute Cargo", price: 185.0, category: "Bottoms", imageUrl: "/products/px-04.png", description: "Ultra-wide, zero-gravity feel parachute pants constructed with ripstop parachute silk. Features adjustable ankle toggles and deep utility pockets." },
  "hx-02": { id: "hx-02", name: "Volt Schematic Hoodie", price: 120.0, category: "Tops", imageUrl: "/products/hx-02.png", description: "Heavyweight 500gsm french terry cotton hoodie featuring a glowing 'Volt' schematic print across the back, outlining the neural architecture of the VOLT ecosystem." },
  "tx-05": { id: "tx-05", name: "Phantom Shell Windbreaker", price: 210.0, category: "Outerwear", imageUrl: "/products/tx-05.png", description: "Whisper-quiet ultra-lightweight shell jacket. Designed for high-velocity urban traversal." },
  "fx-01": { id: "fx-01", name: "Stomper Cyber Boot", price: 280.0, category: "Footwear", imageUrl: "/products/fx-01.png", description: "High-traction vibram sole mapped with a matte-black leather and neoprene sock upper. Built for the concrete jungle." },
  "px-09": { id: "px-09", name: "Tactical Modular Pant", price: 195.0, category: "Bottoms", imageUrl: "/products/px-09.png", description: "Water-resistant articulating trousers featuring fully detachable lower legs to convert to tactical shorts." },
  "ax-09": { id: "ax-09", name: "Modular Sling Rig", price: 85.0, category: "Accessories", imageUrl: "/products/ax-09.png", description: "Cross-body tactical sling with MOLLE webbing for attaching modular pouches." },
  "m-01": { id: "m-01", name: "Volt Schematic Sticker Pack", price: 15.0, category: "Merch", imageUrl: "/products/m-01.png", description: "High-quality die-cut vinyl stickers featuring the Syndicate and Volt lore assets." },
  "m-02": { id: "m-02", name: "Syndicate Nalgene Bottle 32oz", price: 35.0, category: "Merch", imageUrl: "/products/m-02.png", description: "Tritan BPA-free 32oz water bottle with aggressive branding for urban survival." },
  "m-04": { id: "m-04", name: "Cyber Beanie", price: 45.0, category: "Accessories", imageUrl: "/products/m-04.png", description: "Chunky knit wool-blend beanie with a matte metal tactical logo plate." },
  "ax-11": { id: "ax-11", name: "Scout Technical Vest", price: 155.0, category: "Outerwear", imageUrl: "/products/ax-11.png", description: "Black utility vest with MOLLE webbing and multiple symmetrical tactical pouches." },
  "hx-05": { id: "hx-05", name: "Mesh Base Layer", price: 65.0, category: "Tops", imageUrl: "/products/hx-05.png", description: "Tight athletic fit, dark grey black moisture-wicking fabric with breathable high-tech mesh panels." }
};

const SIZES = ["S", "M", "L", "XL"];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, isLoggedIn, addPoints } = useStore();
  const { addToast } = useToastStore();
  
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [isAdded, setIsAdded] = useState(false);

  // Safely extract the ID from params
  const idStr = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const product = idStr ? MOCK_DB[idStr] : null;

  if (!product) {
    return (
      <main className="min-h-screen pt-24 bg-transparent flex items-center justify-center">
        <Navbar />
        <div className="text-center font-mono">
          <h1 className="text-4xl text-cyber-red mb-4 uppercase">ERR: ASSET_NOT_FOUND</h1>
          <button onClick={() => router.back()} className="text-volt hover:underline uppercase text-sm">Return to Index</button>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      quantity: 1,
      size: selectedSize
    });

    addToast(`[LOADOUT_UPDATED]: ${product.name} appended.`, "success");

    // Simulate earning points on purchase if logged in (for demo purposes)
    if (isLoggedIn) {
       addPoints(Math.floor(product.price));
       addToast(`[SYNDICATE_LINK]: +${Math.floor(product.price)} Volt Points verified.`, "system");
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <main className="min-h-screen pt-24 bg-transparent">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground/50 hover:text-volt transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back to Archive
        </button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery */}
          <div className="relative aspect-[4/5] bg-foreground/5 border border-foreground/10 p-4">
            <div className="absolute inset-0 m-4 bg-foreground/10">
              <Image 
                src={product.imageUrl} 
                alt={product.name}
                fill 
                className="object-cover opacity-90"
                priority
              />
            </div>
            
            <div className="absolute top-8 right-8 font-mono text-[10px] text-volt border border-volt/30 bg-volt/10 backdrop-blur-sm px-2 py-1 rotate-90 origin-right tracking-widest uppercase">
              // SCANNED_ASSET
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center bg-background/40 backdrop-blur-md p-8 md:p-12 border border-foreground/5 h-fit">
            <div className="mb-8 border-b border-foreground/10 pb-8">
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest border border-foreground/10 px-2 py-1">
                  {product.category}
                </span>
                <span className="font-mono font-bold text-volt text-2xl">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <h1 className="font-display font-black text-4xl lg:text-5xl uppercase tracking-tighter leading-tight">
                {product.name}
              </h1>
            </div>

             <div className="mb-10">
               <p className="font-sans text-foreground/70 leading-relaxed">
                 {product.description}
               </p>
             </div>

            {/* Sizing (Skip for accessories/merch) */}
            {product.category !== "Merch" && product.category !== "Accessories" && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono uppercase text-xs tracking-widest text-foreground/50">Select Size</span>
                  <button className="font-mono uppercase text-[10px] tracking-widest text-foreground/30 hover:text-volt underline transition-colors">Size Guide</button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-4 font-mono text-sm border transition-all ${
                        selectedSize === size 
                          ? 'border-volt text-volt bg-volt/10 font-bold' 
                          : 'border-foreground/10 text-foreground/60 hover:border-foreground/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`w-full py-6 font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                isAdded 
                  ? 'bg-volt text-background' 
                  : 'bg-foreground text-background hover:bg-volt hover:text-background'
              }`}
            >
              {isAdded ? (
                <><Check size={20} /> Requisition SECURED</>
              ) : (
                'Add to Loadout'
              )}
            </button>

            {isLoggedIn && (
               <div className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-cyber-red/80">
                 + {Math.floor(product.price)} VOLT POINTS UPON ACQUISITION
               </div>
            )}
          </div>
        </div>

        {/* --- Related Assets --- */}
        <div className="mt-32 border-t border-foreground/10 pt-16">
          <h2 className="font-display font-bold text-3xl uppercase tracking-tighter mb-8">
            Related Assets<span className="text-volt">.</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.values(MOCK_DB)
              .filter(p => p.id !== product.id)
              .slice(0, 4)
              .map(p => (
                <div key={p.id} onClick={() => router.push(`/shop/${p.id}`)} className="cursor-pointer group relative bg-background/80 backdrop-blur-md border border-foreground/5 hover:border-volt/30 transition-colors">
                  <div className="relative aspect-square">
                    <Image 
                      src={p.imageUrl} 
                      alt={p.name} 
                      fill 
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                  <div className="p-4 bg-background transition-colors duration-500">
                    <div className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest mb-1">{p.category}</div>
                    <div className="font-sans font-medium text-sm truncate">{p.name}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
