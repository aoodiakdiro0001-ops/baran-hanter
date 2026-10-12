const CATEGORIES = [
  { slug: "electronics", name_key: "cat_electronics", icon: "cpu", sort_order: 1 },
  { slug: "computers", name_key: "cat_computers", icon: "monitor", sort_order: 2 },
  { slug: "home", name_key: "cat_home", icon: "home", sort_order: 3 },
  { slug: "fashion", name_key: "cat_fashion", icon: "shirt", sort_order: 4 },
  { slug: "beauty", name_key: "cat_beauty", icon: "sparkles", sort_order: 5 },
  { slug: "sports", name_key: "cat_sports", icon: "dumbbell", sort_order: 6 },
  { slug: "books", name_key: "cat_books", icon: "book", sort_order: 7 },
  { slug: "toys", name_key: "cat_toys", icon: "puzzle", sort_order: 8 },
  { slug: "automotive", name_key: "cat_automotive", icon: "car", sort_order: 9 },
  { slug: "pets", name_key: "cat_pets", icon: "paw", sort_order: 10 },
  { slug: "office", name_key: "cat_office", icon: "briefcase", sort_order: 11 },
  { slug: "baby", name_key: "cat_baby", icon: "baby", sort_order: 12 },
  { slug: "garden", name_key: "cat_garden", icon: "leaf", sort_order: 13 },
  { slug: "tools", name_key: "cat_tools", icon: "wrench", sort_order: 14 },
  { slug: "health", name_key: "cat_health", icon: "heart", sort_order: 15 },
];

const CATALOG = {
  electronics: {
    brands: ["Sony", "Samsung", "Anker", "Bose", "JBL", "Apple", "LG", "Philips", "Xiaomi", "Sony"],
    items: [
      ["WH-1000XM5 Wireless Headphones", 278, 349],
      ["Galaxy Buds2 Pro", 149, 229],
      ["Soundcore Liberty 4 NC", 79, 99],
      ["QuietComfort Ultra Earbuds", 219, 299],
      ["Flip 6 Portable Speaker", 89, 129],
      ["AirPods Pro 2", 199, 249],
      ["OLED C3 55-Inch TV", 1099, 1499],
      ["Hue White Ambiance Starter", 79, 99],
      ["Redmi Note 13 Pro", 279, 349],
      ["WF-1000XM5 Earbuds", 248, 299],
      ["65-Inch QLED 4K Smart TV", 798, 1099],
      ["PowerCore 20000 Power Bank", 45, 59],
    ],
  },
  computers: {
    brands: ["Dell", "Lenovo", "ASUS", "Logitech", "Keychron", "Samsung", "WD", "Intel", "HP", "Acer", "Razer", "Corsair"],
    items: [
      ["XPS 13 OLED Laptop", 1199, 1499],
      ["ThinkPad X1 Carbon Gen 12", 1449, 1899],
      ["ROG Zephyrus G14", 1299, 1699],
      ["MX Master 3S Mouse", 89, 119],
      ["K2 Mechanical Keyboard", 79, 99],
      ["T7 Shield 2TB SSD", 149, 199],
      ["My Passport 5TB Drive", 99, 139],
      ["Core i7-14700K Processor", 379, 429],
      ["Pavilion 27-Inch 4K Monitor", 329, 449],
      ["Nitro 5 Gaming Laptop", 899, 1199],
      ["BlackWidow V4 Keyboard", 159, 199],
      ["Vengeance 32GB DDR5 Kit", 109, 149],
    ],
  },
  home: {
    brands: ["Instant Pot", "Dyson", "Ninja", "iRobot", "Philips", "KitchenAid", "Cuisinart", "Shark", "Breville", "Lodge", "OXO", "Simplehuman"],
    items: [
      ["Duo Plus 6Qt Pressure Cooker", 89, 129],
      ["V15 Detect Vacuum", 549, 749],
      ["Air Fryer Pro 5.5Qt", 99, 149],
      ["Roomba j7+ Robot Vacuum", 499, 799],
      ["3000 Series Air Purifier", 179, 249],
      ["Artisan Stand Mixer", 379, 479],
      ["Food Processor 14-Cup", 159, 229],
      ["Stratos Cordless Vacuum", 349, 449],
      ["Barista Express Espresso", 599, 749],
      ["Cast Iron Skillet 12-Inch", 34, 49],
      ["Good Grips 4-Piece Set", 29, 44],
      ["Sensor Can 45L", 149, 199],
    ],
  },
  fashion: {
    brands: ["Levi's", "Nike", "Adidas", "The North Face", "Ray-Ban", "Casio", "Clarks", "Patagonia", "Uniqlo", "New Balance", "Carhartt", "Timberland"],
    items: [
      ["501 Original Fit Jeans", 59, 89],
      ["Air Force 1 '07 Sneakers", 90, 110],
      ["Ultraboost Light Running", 140, 190],
      ["Thermoball Eco Jacket", 159, 229],
      ["Aviator Classic Sunglasses", 154, 204],
      ["G-Shock GA-2100 Watch", 99, 130],
      ["Wallabee Boots", 140, 180],
      ["Better Sweater Fleece", 99, 139],
      ["Heattech Crew Neck Pack", 29, 39],
      ["574 Core Sneakers", 84, 110],
      ["Relaxed Fit Canvas Pant", 44, 59],
      ["6-Inch Premium Boot", 168, 210],
    ],
  },
  beauty: {
    brands: ["CeraVe", "The Ordinary", "Dyson", "Olaplex", "La Roche-Posay", "Neutrogena", "Maybelline", "e.l.f.", "COSRX", "Laneige", "Paula's Choice", "The INKEY List"],
    items: [
      ["Moisturizing Cream 19oz", 16, 24],
      ["Niacinamide 10% + Zinc 1%", 6, 12],
      ["Airwrap Multi-Styler", 459, 599],
      ["No.3 Hair Perfector", 30, 38],
      ["Anthelios Melt-In SPF 60", 22, 32],
      ["Hydro Boost Water Gel", 18, 26],
      ["Lash Sensational Mascara", 8, 12],
      ["Halo Glow Liquid Filter", 14, 18],
      ["Snail Mucin 96 Essence", 19, 25],
      ["Lip Sleeping Mask", 22, 24],
      ["2% BHA Liquid Exfoliant", 32, 38],
      ["Hyaluronic Acid Serum", 8, 11],
    ],
  },
  sports: {
    brands: ["Nike", "Yeti", "Hydro Flask", "Manduka", "Bowflex", "Garmin", "Fitbit", "Theragun", "Wilson", "Yeti", "Under Armour", "TRX"],
    items: [
      ["Metcon 9 Training Shoes", 140, 150],
      ["Rambler 30oz Tumbler", 35, 40],
      ["Standard Mouth 32oz Bottle", 44, 50],
      ["PRO Yoga Mat 6mm", 88, 108],
      ["SelectTech 552 Dumbbells", 379, 429],
      ["Forerunner 265 Watch", 399, 449],
      ["Charge 6 Fitness Tracker", 129, 159],
      ["Mini Massage Gun", 149, 199],
      ["NCAA Replica Basketball", 24, 34],
      ["Hopper Flip 12 Cooler", 250, 300],
      ["Tech 2.0 Short Sleeve", 25, 30],
      ["GO Suspension Trainer", 129, 179],
    ],
  },
  books: {
    brands: ["Penguin", "Crown", "Scribner", "Clarkson Potter", "Portfolio", "Avery", "Celadon", "Little Brown", "Random House", "Harper", "Simon & Schuster", "Macmillan"],
    items: [
      ["Atomic Habits Hardcover", 14, 27],
      ["The Psychology of Money", 12, 19],
      ["Project Hail Mary", 13, 20],
      ["Salt Fat Acid Heat", 22, 35],
      ["The Lean Startup", 16, 28],
      ["Educated: A Memoir", 12, 18],
      ["Tomorrow and Tomorrow", 15, 28],
      ["The Housemaid", 10, 14],
      ["Fourth Wing Paperback", 14, 20],
      ["Ikigai: The Japanese Secret", 11, 16],
      ["Sapiens: A Brief History", 15, 24],
      ["The Creative Act", 22, 32],
    ],
  },
  toys: {
    brands: ["LEGO", "Nintendo", "Melissa & Doug", "Hasbro", "Mattel", "Spin Master", "Ravensburger", "Playmobil", "Barbie", "Hot Wheels", "Pokémon", "Exploding Kittens"],
    items: [
      ["Botanical Garden Set 10359", 89, 99],
      ["Switch OLED Console", 319, 349],
      ["Wooden Railway Set", 49, 69],
      ["Monopoly Classic", 18, 22],
      ["UNO Card Game", 7, 11],
      ["Bitzee Interactive Digital Pet", 24, 30],
      ["1000-Piece Landscape Puzzle", 16, 22],
      ["Pirate Ship Playset", 79, 99],
      ["Dreamhouse Playset", 149, 199],
      ["Mega Hauler Track Set", 39, 54],
      ["Trading Card Elite Trainer", 44, 50],
      ["Original Party Pack", 14, 20],
    ],
  },
  automotive: {
    brands: ["Chemical Guys", "Michelin", "NOCO", "Garmin", "WeatherTech", "Meguiar's", "Bosch", "Anker", "Thule", "Rain-X", "Armor All", "Nilight"],
    items: [
      ["Car Wash Kit 16-Piece", 49, 69],
      ["Defender T+H 4-Tire Set", 640, 780],
      ["Genius 10 Jump Starter", 99, 129],
      ["Dash Cam Mini 2", 149, 199],
      ["FloorLiner HP Front", 129, 179],
      ["Ultimate Wash & Wax", 12, 16],
      ["ICON Wiper Blades Pair", 28, 38],
      ["Roav Dash Cam C1", 49, 79],
      ["Motion XT Roof Box", 699, 899],
      ["Latitude Water Repellent", 8, 12],
      ["Protectant Spray 16oz", 7, 10],
      ["60-Inch LED Light Bar", 59, 89],
    ],
  },
  pets: {
    brands: ["Furbo", "PetSafe", "Kong", "Hill's", "Purina", "Chuckit", "PetFusion", "Furminator", "Greenies", "Outward Hound", "Catit", "Pet Armor"],
    items: [
      ["360° Treat-Tossing Camera", 169, 249],
      ["Drinkwell Platinum Fountain", 59, 79],
      ["Classic Dog Toy Large", 12, 16],
      ["Science Diet Adult 30lb", 64, 78],
      ["Pro Plan Sensitive Skin 24lb", 52, 64],
      ["Ultra Fetch Ball 2-Pack", 10, 14],
      ["Ultimate Cat Scratcher Lounge", 39, 49],
      ["Deshedding Tool Large", 32, 40],
      ["Dental Treats Teenie 43oz", 28, 36],
      ["Hide-A-Squirrel Puzzle", 12, 16],
      ["Flower Fountain Stainless", 34, 44],
      ["Plus Flea Tick for Dogs", 44, 58],
    ],
  },
  office: {
    brands: ["Herman Miller", "Secretlab", "Logitech", "Remarkable", "Moleskine", "Fellowes", "HP", "Epson", "Uplift", "Anker", "Post-it", "Pilot"],
    items: [
      ["Aeron Chair Remastered", 1395, 1795],
      ["Titan Evo 2022 Chair", 519, 549],
      ["MX Keys S Keyboard", 99, 119],
      ["Paper Pro 11.8 Tablet", 479, 629],
      ["Classic Notebook Ruled", 18, 24],
      ["Powershred 79Ci Shredder", 229, 299],
      ["OfficeJet Pro 9015e", 229, 279],
      ["EcoTank ET-2850 Printer", 249, 349],
      ["Standing Desk 60x30", 599, 799],
      ["USB-C Hub 7-in-1", 29, 45],
      ["Super Sticky Notes 24-Pack", 14, 20],
      ["G2 Retractable 12-Pack", 11, 16],
    ],
  },
  baby: {
    brands: ["UPPAbaby", "Graco", "Hatch", "Owlet", "BabyBjorn", "Medela", "Fisher-Price", "Skip Hop", "Halo", "Aden + Anais", "Chicco", "Ergobaby"],
    items: [
      ["Vista V2 Stroller", 999, 1099],
      ["4Ever DLX 4-in-1 Car Seat", 229, 299],
      ["Rest+ Sound Machine", 59, 70],
      ["Dream Sock Monitor", 299, 399],
      ["Bouncer Balance Soft", 199, 239],
      ["Pump In Style with MaxFlow", 179, 229],
      ["Deluxe Kick & Play Piano", 44, 54],
      ["Activity Center 3-Stage", 89, 119],
      ["Bassinet Swivel Sleeper", 179, 219],
      ["Muslin Swaddle 4-Pack", 42, 55],
      ["KeyFit 35 Infant Car Seat", 199, 229],
      ["Omni 360 Cool Air Mesh", 179, 199],
    ],
  },
  garden: {
    brands: ["Weber", "Black+Decker", "AeroGarden", "Govee", "Scotts", "Fiskars", "Gardena", "Solo", "Planters Choice", "Rain Bird", "Sun Joe", "Vivosun"],
    items: [
      ["Spirit II E-310 Grill", 449, 529],
      ["20V MAX Hedge Trimmer", 79, 99],
      ["Harvest Elite Indoor Garden", 149, 199],
      ["RGBIC Outdoor String Lights", 39, 59],
      ["Turf Builder 12.5lb", 22, 28],
      ["PowerGear2 Pruner", 24, 32],
      ["Comfort Hose 50ft", 34, 48],
      ["One-Hand Pressure Sprayer", 29, 39],
      ["Herb Garden Starter Kit", 19, 29],
      ["Drip Irrigation Kit", 32, 44],
      ["21-Inch Electric Mower", 169, 229],
      ["4x2 Grow Tent Kit", 89, 129],
    ],
  },
  tools: {
    brands: ["DeWalt", "Milwaukee", "Bosch", "Makita", "Klein", "Stanley", "Craftsman", "Ryobi", "Worx", "Leatherman", "Fluke", "Irwin"],
    items: [
      ["20V MAX Drill Combo", 149, 199],
      ["M18 Fuel Impact Driver", 179, 229],
      ["12V Max 2-Tool Kit", 129, 169],
      ["18V LXT Impact Wrench", 199, 269],
      ["11-in-1 Screwdriver", 16, 22],
      ["FatMax Tape 25ft 2-Pack", 22, 32],
      [" Mechanic 230-Piece Set", 89, 129],
      ["18V One+ Drill Kit", 79, 99],
      ["20V Power Share Drill", 59, 89],
      ["Wave+ Multi-Tool", 99, 120],
      ["101 Basic Digital Multimeter", 129, 159],
      ["Vise-Grip GrooveLock 3-Pack", 34, 48],
    ],
  },
  health: {
    brands: ["Omron", "Withings", "TheraBreath", "Nature Made", "Nordic Naturals", "NOW", "Waterpik", "Oral-B", "Philips", "Tempo", "Renpho", "CVS Health"],
    items: [
      ["Platinum Blood Pressure Monitor", 69, 89],
      ["Body Smart Scale", 99, 129],
      ["Fresh Breath Oral Rinse", 9, 13],
      ["Vitamin D3 2000 IU 250ct", 12, 18],
      ["Ultimate Omega 1280mg", 34, 46],
      ["Magnesium Glycinate 180ct", 16, 22],
      ["Aquarius Water Flosser", 59, 79],
      ["iO Series 4 Toothbrush", 99, 149],
      ["Sonicare 4100 Electric", 39, 59],
      ["Move Portable Massager", 79, 119],
      ["Smart Body Scale", 26, 36],
      ["Advanced First Aid Kit 300pc", 24, 34],
    ],
  },
};

function imageFor(sku) {
  return `https://picsum.photos/seed/${encodeURIComponent(sku)}/640/640`;
}

function seedCatalog(store) {
  const existing = store.get("SELECT COUNT(*) AS n FROM products");
  if (existing && existing.n > 0) return { seeded: false, products: existing.n };

  CATEGORIES.forEach((c) => {
    store.run(
      "INSERT INTO categories (slug, name_key, icon, sort_order) VALUES (?, ?, ?, ?)",
      [c.slug, c.name_key, c.icon, c.sort_order]
    );
  });

  const cats = store.all("SELECT id, slug FROM categories");
  const catId = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  let n = 0;
  for (const [slug, pack] of Object.entries(CATALOG)) {
    pack.items.forEach((item, i) => {
      const [title, price, compare] = item;
      const brand = pack.brands[i % pack.brands.length];
      const sku = `BH-${slug.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(3, "0")}`;
      const featured = i < 2 ? 1 : 0;
      const deal = compare - price >= 20 || i % 3 === 0 ? 1 : 0;
      const rating = Number((4.2 + (i % 7) * 0.1).toFixed(1));
      const reviews = 120 + i * 87 + slug.length * 13;
      store.run(
        `INSERT INTO products
          (sku, category_id, title, brand, description, image, price, compare_at, rating, reviews, stock_hint, amazon_query, featured, deal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sku,
          catId[slug],
          title,
          brand,
          `${brand} ${title}. Curated by Baran Hanter with a competitive display price. Complete checkout on Amazon via our affiliate link.`,
          imageFor(sku),
          price,
          compare,
          rating,
          reviews,
          i === 11 ? "low_stock" : "in_stock",
          `${brand} ${title}`,
          featured,
          deal,
        ]
      );
      n += 1;
    });
  }

  return { seeded: true, products: n, categories: CATEGORIES.length };
}

export { seedCatalog, CATEGORIES };
