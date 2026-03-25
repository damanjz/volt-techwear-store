import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

const products = [
  // Shop Products
  {
    id: "tx-01",
    name: "Aegis Utility Jacket // V2",
    description: "High-performance modular outerwear with integrated heat-mapped venting. Water-resistant DWR coating and YKK Aquaguard zippers.",
    price: 345.0,
    category: "Outerwear",
    imageUrl: "/products/tx-01.png",
    isNew: true,
    isActive: true,
    isClassified: false,
    tags: "jacket,outerwear,utility",
    stock: 50
  },
  {
    id: "px-04",
    name: "Carbon Parachute Cargo",
    description: "Ultra-lightweight ripstop nylon cargo pants with adjustable hem toggles and 8-pocket tactical configuration.",
    price: 185.0,
    category: "Bottoms",
    imageUrl: "/products/px-04.png",
    isNew: true,
    isActive: true,
    isClassified: false,
    tags: "pants,cargo,bottoms",
    stock: 75
  },
  {
    id: "hx-02",
    name: "Volt Schematic Hoodie",
    description: "Heavyweight 450GSM cotton hoodie featuring the signature Volt schematic print. Oversized cyber-fit.",
    price: 120.0,
    category: "Tops",
    imageUrl: "/products/hx-02.png",
    isActive: true,
    isClassified: false,
    tags: "hoodie,tops,schematic",
    stock: 100
  },
  {
    id: "tx-05",
    name: "Phantom Shell Windbreaker",
    description: "Transparent-matte performance shell. Windproof and breathable with laser-cut ventilation ports.",
    price: 210.0,
    category: "Outerwear",
    imageUrl: "/products/tx-05.png",
    isActive: true,
    isClassified: false,
    tags: "windbreaker,outerwear,shell",
    stock: 40
  },
  {
    id: "fx-01",
    name: "Stomper Cyber Boot",
    description: "Vibram-soled tactical footwear with quick-lace system and reinforced carbon fiber toe box.",
    price: 280.0,
    category: "Footwear",
    imageUrl: "/products/fx-01.png",
    isActive: true,
    isClassified: false,
    tags: "boots,footwear,tactical",
    stock: 30
  },
  {
    id: "px-09",
    name: "Tactical Modular Pant",
    description: "Scholler Dryskin fabric with articulated knees for maximum mobility. 4-way stretch comfort.",
    price: 195.0,
    category: "Bottoms",
    imageUrl: "/products/px-09.png",
    isActive: true,
    isClassified: false,
    tags: "pants,bottoms,tactical",
    stock: 60
  },
  {
    id: "ax-11",
    name: "Scout Technical Vest",
    description: "MOLLE-compatible modular vest designed for urban layering. Features hidden magnetic stash pockets.",
    price: 155.0,
    category: "Outerwear",
    imageUrl: "/products/ax-11.png",
    isActive: true,
    isClassified: false,
    tags: "vest,outerwear,technical",
    stock: 25
  },
  {
    id: "hx-05",
    name: "Mesh Base Layer",
    description: "Technical polyester mesh with holographic seam taping. Breathability optimized for high-intensity activity.",
    price: 65.0,
    category: "Tops",
    imageUrl: "/products/hx-05.png",
    isActive: true,
    isClassified: false,
    tags: "tops,mesh,baselayer",
    stock: 120
  },
  // Merch Products
  {
    id: "m-01",
    name: "Volt Schematic Sticker Pack",
    description: "Set of 5 high-durability vinyl stickers featuring Volt hardware schematics and Syndicate logos.",
    price: 15.0,
    category: "Merch",
    imageUrl: "/products/m-01.png",
    isNew: true,
    isActive: true,
    isClassified: false,
    tags: "merch,stickers",
    stock: 500
  },
  {
    id: "m-02",
    name: "Syndicate Nalgene Bottle 32oz",
    description: "BPA-free wide-mouth bottle with glowing Syndicate typography. Built for tactical hydration.",
    price: 35.0,
    category: "Merch",
    imageUrl: "/products/m-02.png",
    isActive: true,
    isClassified: false,
    tags: "merch,bottle",
    stock: 150
  },
  {
    id: "ax-09",
    name: "Modular Sling Rig",
    description: "Triple-compartment sling bag with X-Pac™ technical fabric and Fidlock® magnetic buckles.",
    price: 85.0,
    category: "Accessories",
    imageUrl: "/products/ax-09.png",
    isActive: true,
    isClassified: false,
    tags: "accessories,bag,sling",
    stock: 45
  },
  {
    id: "m-04",
    name: "Cyber Beanie",
    description: "Double-layered merino wool beanie with 3M reflective Volt branding.",
    price: 45.0,
    category: "Accessories",
    imageUrl: "/products/m-04.png",
    isActive: true,
    isClassified: false,
    tags: "accessories,beanie",
    stock: 200
  },
  // Black Site Products (Classified)
  {
    id: "bs-01",
    name: "0x_NIGHTFALL_RIG",
    description: "UNSANCTIONED EXPERIMENTAL: Next-gen exo-suit prototype with embedded biometric sensors.",
    price: 850.0,
    category: "EXO-WEAR",
    imageUrl: "https://images.unsplash.com/photo-1616885230919-b223049bb4aa?q=80&w=800&auto=format&fit=crop",
    isActive: true,
    isClassified: true,
    tags: "classified,exo,blacksite",
    stock: 5
  },
  {
    id: "bs-02",
    name: "PHANTOM_OPTICS_V4",
    description: "UNSANCTIONED EXPERIMENTAL: Augmented reality visor prototype with thermal imaging capabilities.",
    price: 420.0,
    category: "HARDWARE",
    imageUrl: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=800&auto=format&fit=crop",
    isActive: true,
    isClassified: true,
    tags: "classified,hardware,blacksite",
    stock: 10
  },
  {
    id: "bs-03",
    name: "SYNTH_LEATHER_TRENCH",
    description: "UNSANCTIONED EXPERIMENTAL: Nanofabric trench coat with active camouflage properties.",
    price: 1200.0,
    category: "ARCHIVE",
    imageUrl: "https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=800&auto=format&fit=crop",
    isActive: true,
    isClassified: true,
    tags: "classified,archive,blacksite",
    stock: 3
  }
];

const coupons = [
  {
    id: "coupon-volt20",
    code: "VOLT20",
    description: "20% off your entire order",
    discountType: "PERCENT",
    value: 20.0,
    scope: "SITE",
    usageLimit: 100,
    isActive: true,
  },
  {
    id: "coupon-freeship",
    code: "FREESHIP",
    description: "$10 flat discount",
    discountType: "FLAT",
    value: 10.0,
    scope: "SITE",
    usageLimit: 0,
    isActive: true,
  },
  {
    id: "coupon-blacksite50",
    code: "BLACKSITE50",
    description: "50% off Black Site items",
    discountType: "PERCENT",
    value: 50.0,
    scope: "CATEGORY",
    category: "EXO-WEAR",
    usageLimit: 10,
    isActive: true,
  },
];

const defaultConfigs = [
  { key: "theme.volt", value: "#d4ff33" },
  { key: "theme.cyber-red", value: "#ff1a4f" },
  { key: "theme.background", value: "#0a0a0a" },
  { key: "theme.foreground", value: "#ffffff" },
  { key: "feature.blacksite", value: "true" },
  { key: "feature.banner.active", value: "false" },
  { key: "feature.banner.text", value: "🔥 Use code VOLT20 for 20% off" },
];

export async function GET(request: Request) {
  // Block in production entirely (also blocked by middleware)
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Protect seed endpoint with a secret key
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret || key !== secret) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    // Seed products
    for (const p of products) {
      await prisma.product.upsert({
        where: { id: p.id },
        update: p,
        create: p,
      });
    }

    // Seed admin user with secure password from env
    const adminEmail = process.env.ADMIN_EMAIL || "admin@volt.sys";
    const adminPass = process.env.ADMIN_PASSWORD || "admin123";
    const adminPassword = await bcrypt.hash(adminPass, 12);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: adminPassword,
        role: "ADMIN",
        clearanceLevel: 3,
        voltPoints: 99999,
      },
      create: {
        email: adminEmail,
        password: adminPassword,
        name: "VOLT Admin",
        role: "ADMIN",
        clearanceLevel: 3,
        voltPoints: 99999,
      },
    });

    // Seed coupons
    for (const c of coupons) {
      await prisma.coupon.upsert({
        where: { id: c.id },
        update: c,
        create: c,
      });
    }

    // Seed default configs
    for (const cfg of defaultConfigs) {
      await prisma.siteConfig.upsert({
        where: { key: cfg.key },
        update: {},
        create: cfg,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      counts: {
        products: products.length,
        coupons: coupons.length,
        configs: defaultConfigs.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: "Seeding failed. Check server logs." },
      { status: 500 }
    );
  }
}
