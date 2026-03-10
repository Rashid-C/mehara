const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Noor Flow Abaya",
        slug: "noor-flow-abaya",
        category: "Abaya",
        price: 349,
        stock: 16,
        sizes: "S, M, L, XL",
        image: "https://images.unsplash.com/photo-1611042553365-9b101441c135?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "Soft layered abaya with understated panel detailing.",
        description: "A lightweight abaya designed for graceful movement, clean finishing, and all-day comfort in formal or casual settings.",
        featured: true,
      },
      {
        name: "Safa Classic Pardha",
        slug: "safa-classic-pardha",
        category: "Pardha",
        price: 229,
        stock: 24,
        sizes: "Free Size",
        image: "https://images.unsplash.com/photo-1583391733981-84967ddfc8ff?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "Breathable pardha with refined drape and clean neckline.",
        description: "A practical everyday pardha crafted to balance ease, modest coverage, and polished minimal styling.",
        featured: true,
      },
      {
        name: "Layali Occasion Dress",
        slug: "layali-occasion-dress",
        category: "Women Dress",
        price: 389,
        stock: 10,
        sizes: "S, M, L",
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "A modest evening dress with sculpted sleeves and fluid fall.",
        description: "Built for festive occasions, this dress brings modest proportions together with elegant texture and rich tonal depth.",
        featured: true,
      },
      {
        name: "Rimah Everyday Abaya",
        slug: "rimah-everyday-abaya",
        category: "Abaya",
        price: 299,
        stock: 18,
        sizes: "S, M, L, XL, XXL",
        image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "An everyday abaya with practical tailoring and modern shape.",
        description: "A wardrobe staple with premium fabric feel, easy layering, and a versatile silhouette suited to regular wear.",
        featured: false,
      },
      {
        name: "Hiba Premium Pardha",
        slug: "hiba-premium-pardha",
        category: "Pardha",
        price: 259,
        stock: 15,
        sizes: "Free Size",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "Minimal premium pardha with soft fabric weight and smooth finish.",
        description: "A boutique-style pardha with refined drape and consistent comfort for long wear throughout the day.",
        featured: false,
      },
      {
        name: "Amani Grace Dress",
        slug: "amani-grace-dress",
        category: "Women Dress",
        price: 419,
        stock: 8,
        sizes: "M, L, XL",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
        shortDescription: "Statement modest dress with tailored waistline and flowing hem.",
        description: "An elevated modest dress built for eventwear, designed with clean structure and a graceful profile.",
        featured: true,
      },
    ],
  });

  const seededProducts = await prisma.product.findMany({ take: 2 });

  await prisma.order.create({
    data: {
      customerName: "Aisha Rahman",
      customerPhone: "+971 50 123 4567",
      shippingAddress: "Al Nahda, Dubai, UAE",
      notes: "Call before delivery",
      totalAmount: seededProducts.reduce((sum, product) => sum + product.price, 0),
      status: "CONFIRMED",
      items: {
        create: seededProducts.map((product) => ({
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.price,
          size: product.sizes.split(",")[0].trim(),
        })),
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
