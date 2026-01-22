// Mock Products Data Service
// This simulates API calls and will be replaced with real backend later

const mockProducts = [
  // ELECTRONICS (15 products)
  {
    id: 1,
    title: "iPhone 13 Pro Max 256GB - Excellent Condition",
    price: 450000,
    originalPrice: 520000,
    condition: "Used",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400",
    images: [
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800",
      "https://images.unsplash.com/photo-1611791483458-af8143097bb0?w=800",
      "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=800",
      "https://images.unsplash.com/photo-1592286927505-25f428ac3eb7?w=800",
    ],
    location: "Bosso Campus",
    views: 142,
    description:
      "iPhone 13 Pro Max in excellent condition. Battery health 95%. Comes with original charger and box. No scratches on screen.",
    seller: {
      id: 1,
      name: "Aisha Mohammed",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-15T10:30:00Z",
  },
  {
    id: 2,
    title: "MacBook Pro 2021 M1 Chip - Like New",
    price: 780000,
    condition: "New",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
    ],
    location: "Gidan Kwano",
    views: 289,
    description:
      "Brand new MacBook Pro M1. 8GB RAM, 256GB SSD. Still under warranty. Perfect for students and professionals.",
    seller: {
      id: 2,
      name: "Chukwudi Okafor",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-20T14:20:00Z",
  },
  {
    id: 3,
    title: "Samsung Galaxy S23 Ultra 512GB",
    price: 520000,
    condition: "New",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800",
    ],
    location: "Main Campus",
    views: 321,
    description:
      "Brand new Samsung Galaxy S23 Ultra. 512GB storage, 12GB RAM. Factory sealed with full warranty.",
    seller: {
      id: 3,
      name: "Daniel Adeyemi",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-11-02T13:00:00Z",
  },
  {
    id: 4,
    title: "Gaming Laptop - ASUS ROG Strix G15",
    price: 650000,
    originalPrice: 750000,
    condition: "Used",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
    ],
    location: "Bosso Campus",
    views: 198,
    description:
      "ASUS ROG Strix G15 gaming laptop. RTX 3060, 16GB RAM, 512GB SSD. Perfect for gaming and heavy tasks.",
    seller: {
      id: 4,
      name: "Ibrahim Usman",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-11-01T16:45:00Z",
  },
  {
    id: 5,
    title: "HP ProBook 450 G8 Laptop",
    price: 280000,
    condition: "Used",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    ],
    location: "Main Campus",
    views: 156,
    description:
      "HP ProBook 450 G8. Intel i5 11th Gen, 8GB RAM, 512GB SSD. Perfect for students.",
    seller: {
      id: 5,
      name: "Sarah Ibrahim",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-22T15:10:00Z",
  },
  {
    id: 6,
    title: "Dell Latitude 5450 - Business Laptop",
    price: 320000,
    condition: "Used",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800",
    ],
    location: "Gidan Kwano",
    views: 134,
    description:
      "Dell Latitude 5450. Intel i7, 16GB RAM, 512GB SSD. Professional laptop in great condition.",
    seller: {
      id: 6,
      name: "Olamide Bello",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-28T09:00:00Z",
  },
  {
    id: 7,
    title: "iPad Air 5th Gen 256GB - WiFi Only",
    price: 380000,
    condition: "Like New",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800",
    ],
    location: "Bosso Campus",
    views: 187,
    description:
      "iPad Air 5th Gen with M1 chip. 256GB storage. Comes with Apple Pencil 2nd Gen and smart folio case.",
    seller: {
      id: 7,
      name: "Chioma Nwosu",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-25T11:30:00Z",
  },
  {
    id: 8,
    title: "Apple Watch Series 8 - 45mm GPS",
    price: 195000,
    originalPrice: 240000,
    condition: "Used",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
    images: [
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
    ],
    location: "Main Campus",
    views: 98,
    description:
      "Apple Watch Series 8. 45mm case, GPS model. Includes 3 extra bands. Battery health 92%.",
    seller: {
      id: 8,
      name: "Tunde Bakare",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-30T14:15:00Z",
  },
  {
    id: 9,
    title: "Sony WH-1000XM5 Noise Cancelling Headphones",
    price: 145000,
    condition: "New",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
    ],
    location: "Gidan Kwano",
    views: 223,
    description:
      "Brand new Sony WH-1000XM5. Industry-leading noise cancellation. Perfect for study sessions.",
    seller: {
      id: 9,
      name: "Amina Suleiman",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-11-03T08:45:00Z",
  },
  {
    id: 10,
    title: "Canon EOS M50 Mark II Camera",
    price: 285000,
    condition: "Used",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
      "https://images.unsplash.com/photo-1606933248973-ba0c5d4f7cac?w=800",
    ],
    location: "Bosso Campus",
    views: 167,
    description:
      "Canon EOS M50 Mark II with 15-45mm kit lens. Perfect for content creation and photography students.",
    seller: {
      id: 10,
      name: "Oluwaseun Adebayo",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-27T16:20:00Z",
  },
  {
    id: 11,
    title: "Samsung 27 Curved Gaming Monitor",
    price: 125000,
    condition: "Used",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800",
    ],
    location: "Main Campus",
    views: 145,
    description:
      "Samsung 27-inch curved gaming monitor. 144Hz refresh rate, 1080p. HDMI and DisplayPort included.",
    seller: {
      id: 11,
      name: "Kingsley Eze",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-29T12:10:00Z",
  },
  {
    id: 12,
    title: "AirPods Pro 2nd Generation",
    price: 115000,
    condition: "New",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400",
    images: [
      "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800",
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800",
    ],
    location: "Bosso Campus",
    views: 312,
    description:
      "Brand new sealed AirPods Pro 2nd Gen. USB-C charging case. Active noise cancellation.",
    seller: {
      id: 12,
      name: "Grace Nwankwo",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-11-04T10:00:00Z",
  },
  {
    id: 13,
    title: "Logitech MX Master 3S Wireless Mouse",
    price: 38000,
    condition: "Like New",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
    ],
    location: "Gidan Kwano",
    views: 76,
    description:
      "Logitech MX Master 3S. Ergonomic wireless mouse perfect for productivity. Barely used.",
    seller: {
      id: 13,
      name: "Musa Abdullahi",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-31T15:30:00Z",
  },
  {
    id: 14,
    title: "Portable Power Bank 30000mAh",
    price: 15000,
    condition: "New",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800",
    ],
    location: "Main Campus",
    views: 234,
    description:
      "30000mAh portable power bank. Fast charging. Can charge laptops, phones, and tablets.",
    seller: {
      id: 14,
      name: "Blessing Okoro",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-11-02T09:20:00Z",
  },
  {
    id: 15,
    title: "JBL Flip 6 Portable Bluetooth Speaker",
    price: 42000,
    condition: "Used",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",
    ],
    location: "Bosso Campus",
    views: 189,
    description:
      "JBL Flip 6 Bluetooth speaker. Waterproof, 12-hour battery life. Great sound quality.",
    seller: {
      id: 15,
      name: "Ahmed Bello",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-26T13:40:00Z",
  },

  // BOOKS & STATIONERY (10 products)
  {
    id: 16,
    title: "Engineering Mathematics Textbook Set",
    price: 15000,
    condition: "Used",
    category: "books",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
    images: ["https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800"],
    location: "Main Campus",
    views: 67,
    description:
      "Complete set of Engineering Mathematics books for MTH courses. Includes solution manuals.",
    seller: {
      id: 16,
      name: "Fatima Yusuf",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-25T09:15:00Z",
  },
  {
    id: 17,
    title: "Calculus and Analytic Geometry - Thomas",
    price: 8000,
    condition: "Used",
    category: "books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800"],
    location: "Gidan Kwano",
    views: 43,
    description:
      "Thomas Calculus textbook in good condition. Perfect for MTH 101/102 courses.",
    seller: {
      id: 17,
      name: "Abdul Rahman",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-30T10:05:00Z",
  },
  {
    id: 18,
    title: "Introduction to Algorithms - CLRS",
    price: 12000,
    condition: "Like New",
    category: "books",
    image: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400",
    images: [
      "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=800",
    ],
    location: "Bosso Campus",
    views: 92,
    description:
      "Introduction to Algorithms by Cormen. Essential for Computer Science students. Minimal highlighting.",
    seller: {
      id: 18,
      name: "Chidinma Obi",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-27T14:30:00Z",
  },
  {
    id: 19,
    title: "Physics for Scientists and Engineers",
    price: 18000,
    condition: "Used",
    category: "books",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
    images: [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800",
    ],
    location: "Main Campus",
    views: 58,
    description:
      "Physics textbook with modern physics. Serway & Jewett. Good condition with notes.",
    seller: {
      id: 19,
      name: "Emmanuel Ndubuisi",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-29T11:20:00Z",
  },
  {
    id: 20,
    title: "Organic Chemistry - Morrison & Boyd",
    price: 14000,
    condition: "Used",
    category: "books",
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400",
    images: [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800",
    ],
    location: "Gidan Kwano",
    views: 71,
    description:
      "Morrison & Boyd Organic Chemistry. Highlighted chapters. Perfect for CHE 201/202.",
    seller: {
      id: 20,
      name: "Halima Garba",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-24T08:50:00Z",
  },
  {
    id: 21,
    title: "Data Structures and Algorithms in Python",
    price: 10000,
    condition: "Like New",
    category: "books",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
    images: [
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
    ],
    location: "Bosso Campus",
    views: 124,
    description:
      "Data Structures book for Python. Goodrich, Tamassia & Goldwasser. Almost new.",
    seller: {
      id: 21,
      name: "Victor Okonkwo",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-11-01T13:15:00Z",
  },
  {
    id: 22,
    title: "Linear Algebra and Its Applications",
    price: 11000,
    condition: "Used",
    category: "books",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
    images: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
    ],
    location: "Main Campus",
    views: 54,
    description:
      "Linear Algebra by David C. Lay. Good condition. Essential for engineering students.",
    seller: {
      id: 22,
      name: "Ngozi Adekunle",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-26T10:40:00Z",
  },
  {
    id: 23,
    title: "Fundamentals of Electric Circuits",
    price: 16000,
    condition: "Used",
    category: "books",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400",
    images: [
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
    ],
    location: "Gidan Kwano",
    views: 86,
    description:
      "Alexander & Sadiku Electric Circuits. 6th Edition. With practice problems solved.",
    seller: {
      id: 23,
      name: "Yusuf Sani",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-28T15:25:00Z",
  },
  {
    id: 24,
    title: "Strength of Materials - Timoshenko",
    price: 13000,
    condition: "Used",
    category: "books",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    ],
    location: "Bosso Campus",
    views: 47,
    description:
      "Strength of Materials by Timoshenko. Essential for Civil & Mechanical Engineering.",
    seller: {
      id: 24,
      name: "Khadijah Mohammed",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-23T09:30:00Z",
  },
  {
    id: 25,
    title: "Complete Medical Physiology Notes - 300 Level",
    price: 9000,
    condition: "New",
    category: "books",
    image: "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?w=400",
    images: [
      "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?w=800",
    ],
    location: "Main Campus",
    views: 138,
    description:
      "Comprehensive medical physiology notes for 300 level. Neatly printed and bound.",
    seller: {
      id: 25,
      name: "Folake Adeyemi",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-11-03T11:45:00Z",
  },

  // FASHION & APPAREL (8 products)
  {
    id: 26,
    title: "Nike Air Max 270 - Size 43",
    price: 35000,
    originalPrice: 45000,
    condition: "Used",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
    ],
    location: "Bosso Campus",
    views: 89,
    description:
      "Original Nike Air Max 270 in great condition. Size 43 (US 9.5). Worn only a few times.",
    seller: {
      id: 26,
      name: "Emeka Johnson",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-18T08:20:00Z",
  },
  {
    id: 27,
    title: "Adidas Predator Football Boots - Size 42",
    price: 28000,
    condition: "New",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=400",
    images: [
      "https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=800",
    ],
    location: "Main Campus",
    views: 72,
    description:
      "Brand new Adidas Predator football boots. Size 42, perfect for the pitch.",
    seller: {
      id: 27,
      name: "Hassan Musa",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-26T14:40:00Z",
  },
  {
    id: 28,
    title: "Vintage Denim Jacket - Unisex Medium",
    price: 18000,
    condition: "Used",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
    ],
    location: "Gidan Kwano",
    views: 103,
    description:
      "Classic vintage denim jacket. Medium size, fits both guys and ladies. Trendy distressed look.",
    seller: {
      id: 28,
      name: "Zainab Aliyu",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-31T12:00:00Z",
  },
  {
    id: 29,
    title: "Converse Chuck Taylor All Star - White",
    price: 22000,
    condition: "Like New",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400",
    images: [
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800",
    ],
    location: "Bosso Campus",
    views: 156,
    description:
      "Classic white Converse Chuck Taylor. Size 40. Barely worn, almost new condition.",
    seller: {
      id: 29,
      name: "Jennifer Eze",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-29T16:30:00Z",
  },
  {
    id: 30,
    title: "Designer Backpack - Laptop Compartment",
    price: 12000,
    condition: "Used",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800",
    ],
    location: "Main Campus",
    views: 213,
    description:
      "Stylish backpack with padded laptop compartment. Multiple pockets. Perfect for campus life.",
    seller: {
      id: 30,
      name: "Adebola Ogunleye",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-11-02T10:15:00Z",
  },
  {
    id: 31,
    title: "Leather Belt - Brown (Size 34)",
    price: 6000,
    condition: "New",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=400",
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=800",
    ],
    location: "Gidan Kwano",
    views: 67,
    description:
      "Genuine leather belt in brown. Size 34. Brand new with tags. Classic design.",
    seller: {
      id: 31,
      name: "Tolu Adeniyi",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-27T09:45:00Z",
  },
  {
    id: 32,
    title: "Ray-Ban Wayfarer Sunglasses",
    price: 25000,
    originalPrice: 35000,
    condition: "Used",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
    ],
    location: "Bosso Campus",
    views: 94,
    description:
      "Authentic Ray-Ban Wayfarer sunglasses. Classic black frame. Comes with original case.",
    seller: {
      id: 32,
      name: "Chiamaka Nnamdi",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-25T14:20:00Z",
  },
  {
    id: 33,
    title: "Wristwatch - Men's Casual Leather Strap",
    price: 15000,
    condition: "Like New",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800",
    ],
    location: "Main Campus",
    views: 128,
    description:
      "Elegant men's wristwatch with leather strap. Water resistant. Perfect for formal and casual wear.",
    seller: {
      id: 33,
      name: "Uche Okafor",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-30T11:30:00Z",
  },

  // FURNITURE (7 products)
  {
    id: 34,
    title: "Study Desk with Chair - Wooden",
    price: 25000,
    condition: "Used",
    category: "furniture",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800",
    ],
    location: "Gidan Kwano",
    views: 45,
    description:
      "Sturdy wooden study desk with matching chair. Good condition. Ideal for hostel rooms.",
    seller: {
      id: 34,
      name: "Grace Nwankwo",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-28T11:30:00Z",
  },
  {
    id: 35,
    title: "Office Chair - Ergonomic Design",
    price: 35000,
    condition: "Used",
    category: "furniture",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400",
    images: [
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800",
    ],
    location: "Bosso Campus",
    views: 91,
    description:
      "Comfortable ergonomic office chair with lumbar support. Great for long study sessions.",
    seller: {
      id: 35,
      name: "Blessing Okoro",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-29T09:50:00Z",
  },
  {
    id: 36,
    title: "Bookshelf - 5 Tier Wooden Stand",
    price: 18000,
    condition: "Used",
    category: "furniture",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400",
    images: [
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800",
    ],
    location: "Main Campus",
    views: 73,
    description:
      "5-tier wooden bookshelf. Sturdy construction. Perfect for organizing textbooks and materials.",
    seller: {
      id: 36,
      name: "Segun Ajayi",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-24T13:20:00Z",
  },
  {
    id: 37,
    title: "Wardrobe - Double Door with Mirror",
    price: 45000,
    condition: "Used",
    category: "furniture",
    image: "https://images.unsplash.com/photo-1595428773653-32c5fcbd2c96?w=400",
    images: [
      "https://images.unsplash.com/photo-1595428773653-32c5fcbd2c96?w=800",
    ],
    location: "Gidan Kwano",
    views: 112,
    description:
      "Large double-door wardrobe with full-length mirror. Plenty of storage space for clothes.",
    seller: {
      id: 37,
      name: "Mary Adeleke",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-26T15:40:00Z",
  },
  {
    id: 38,
    title: "Reading Lamp - Adjustable LED",
    price: 8000,
    condition: "New",
    category: "furniture",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
    ],
    location: "Bosso Campus",
    views: 186,
    description:
      "LED reading lamp with adjustable brightness. USB rechargeable. Eye-friendly for night study.",
    seller: {
      id: 38,
      name: "Ibrahim Lawal",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-11-01T10:25:00Z",
  },
  {
    id: 39,
    title: "Mini Fridge - 50L Capacity",
    price: 55000,
    condition: "Used",
    category: "furniture",
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400",
    images: [
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800",
    ],
    location: "Main Campus",
    views: 267,
    description:
      "Compact mini fridge, 50L capacity. Perfect for hostel rooms. Low power consumption.",
    seller: {
      id: 39,
      name: "Funke Oladipo",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-28T14:15:00Z",
  },
  {
    id: 40,
    title: "Plastic Storage Drawers - 4 Compartments",
    price: 12000,
    condition: "Like New",
    category: "furniture",
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400",
    images: [
      "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800",
    ],
    location: "Gidan Kwano",
    views: 145,
    description:
      "4-compartment plastic storage drawers. Lightweight and durable. Great for organizing small items.",
    seller: {
      id: 40,
      name: "Anthony Obi",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-31T09:30:00Z",
  },

  // SPORTS & FITNESS (5 products)
  {
    id: 41,
    title: "Yoga Mat with Carrying Strap",
    price: 7000,
    condition: "New",
    category: "sports",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
    ],
    location: "Bosso Campus",
    views: 98,
    description:
      "Premium yoga mat with carrying strap. Non-slip surface. Perfect for workouts and meditation.",
    seller: {
      id: 41,
      name: "Nike Adeleke",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-27T11:45:00Z",
  },
  {
    id: 42,
    title: "Dumbbell Set - 10kg Pair",
    price: 18000,
    condition: "Used",
    category: "sports",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
    images: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    ],
    location: "Main Campus",
    views: 134,
    description:
      "10kg dumbbell set (5kg each). Rubber coating. Perfect for home workouts.",
    seller: {
      id: 42,
      name: "Samuel Oyedepo",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-29T16:20:00Z",
  },
  {
    id: 43,
    title: "Basketball - Official Size 7",
    price: 8500,
    condition: "Used",
    category: "sports",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
    images: ["https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800"],
    location: "Gidan Kwano",
    views: 76,
    description:
      "Official size 7 basketball. Good grip, well-maintained. Ready for the court.",
    seller: {
      id: 43,
      name: "Daniel Ojo",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-30T13:10:00Z",
  },
  {
    id: 44,
    title: "Skipping Rope - Adjustable Length",
    price: 3500,
    condition: "New",
    category: "sports",
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400",
    images: [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800",
    ],
    location: "Bosso Campus",
    views: 167,
    description:
      "Professional skipping rope with adjustable length. Counter feature. Great cardio workout tool.",
    seller: {
      id: 44,
      name: "Patience Eze",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-11-02T08:40:00Z",
  },
  {
    id: 45,
    title: "Tennis Racket - Wilson Pro Staff",
    price: 32000,
    condition: "Like New",
    category: "sports",
    image: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=400",
    images: [
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800",
    ],
    location: "Main Campus",
    views: 89,
    description:
      "Wilson Pro Staff tennis racket. Barely used, excellent condition. Comes with cover.",
    seller: {
      id: 45,
      name: "Tobi Adewale",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-25T15:50:00Z",
  },

  // TECH GADGETS (5 products)
  {
    id: 46,
    title: "PlayStation 5 with 2 Controllers",
    price: 450000,
    condition: "Used",
    category: "gadgets",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",
      "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800",
    ],
    location: "Bosso Campus",
    views: 267,
    description:
      "PS5 disk version with 2 DualSense controllers. Includes FIFA 24 and COD. Excellent condition.",
    seller: {
      id: 46,
      name: "Victor Okonkwo",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-11-03T12:30:00Z",
  },
  {
    id: 47,
    title: "Nintendo Switch OLED - Red & Blue",
    price: 185000,
    condition: "Like New",
    category: "gadgets",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400",
    images: [
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800",
    ],
    location: "Main Campus",
    views: 201,
    description:
      "Nintendo Switch OLED model. Red and blue Joy-Cons. Includes dock and accessories.",
    seller: {
      id: 47,
      name: "Chinedu Okeke",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-28T10:15:00Z",
  },
  {
    id: 48,
    title: "Logitech G502 Gaming Mouse",
    price: 28000,
    condition: "Used",
    category: "gadgets",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
    ],
    location: "Gidan Kwano",
    views: 143,
    description:
      "Logitech G502 HERO gaming mouse. Programmable buttons. RGB lighting. Perfect for gamers.",
    seller: {
      id: 48,
      name: "Ayo Balogun",
      avatar: null,
      verified: false,
    },
    createdAt: "2024-10-26T12:40:00Z",
  },
  {
    id: 49,
    title: "Mechanical Keyboard - RGB Backlit",
    price: 35000,
    condition: "New",
    category: "gadgets",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
    ],
    location: "Bosso Campus",
    views: 178,
    description:
      "RGB mechanical keyboard with blue switches. Clicky and tactile. Great for typing and gaming.",
    seller: {
      id: 49,
      name: "Nkechi Amadi",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-10-31T14:30:00Z",
  },
  {
    id: 50,
    title: "External SSD - 1TB Samsung T7",
    price: 65000,
    condition: "Like New",
    category: "gadgets",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400",
    images: [
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800",
    ],
    location: "Main Campus",
    views: 223,
    description:
      "Samsung T7 1TB external SSD. Super fast transfer speeds. USB-C and USB-A cables included.",
    seller: {
      id: 50,
      name: "Oluwaseun Adebayo",
      avatar: null,
      verified: true,
    },
    createdAt: "2024-11-04T09:20:00Z",
  },
];

// Categories data
export const categories = [
  { id: "all", name: "All Categories", icon: "🏪", count: mockProducts.length },
  {
    id: "electronics",
    name: "Electronics",
    icon: "📱",
    count: mockProducts.filter((p) => p.category === "electronics").length,
  },
  {
    id: "books",
    name: "Books & Stationery",
    icon: "📚",
    count: mockProducts.filter((p) => p.category === "books").length,
  },
  {
    id: "fashion",
    name: "Fashion & Apparel",
    icon: "👕",
    count: mockProducts.filter((p) => p.category === "fashion").length,
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: "🛋️",
    count: mockProducts.filter((p) => p.category === "furniture").length,
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    icon: "⚽",
    count: mockProducts.filter((p) => p.category === "sports").length,
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: "⌚",
    count: mockProducts.filter((p) => p.category === "accessories").length,
  },
  {
    id: "gadgets",
    name: "Tech Gadgets",
    icon: "🎮",
    count: mockProducts.filter((p) => p.category === "gadgets").length,
  },
];

// Use the 50 real products directly
const allProducts = mockProducts;

// Service functions
export const productsService = {
  // Get all products at once (no pagination)
  getAllProducts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...allProducts]);
      }, 300);
    });
  },

  // Get product by ID
  getProductById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = allProducts.find((p) => p.id === parseInt(id));
        if (product) {
          resolve(product);
        } else {
          reject(new Error("Product not found"));
        }
      }, 300);
    });
  },

  // Search products
  searchProducts: (query, filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...allProducts];

        // Search by query
        if (query && query.trim() !== "") {
          const searchTerm = query.toLowerCase();
          results = results.filter(
            (p) =>
              p.title.toLowerCase().includes(searchTerm) ||
              p.description.toLowerCase().includes(searchTerm) ||
              p.category.toLowerCase().includes(searchTerm)
          );
        }

        // Filter by category
        if (filters.category && filters.category !== "all") {
          results = results.filter((p) => p.category === filters.category);
        }

        // Filter by condition
        if (filters.condition && filters.condition !== "all") {
          const conditionMap = {
            new: "New",
            used: "Used",
            "fairly-used": "Used",
          };
          results = results.filter(
            (p) => p.condition === conditionMap[filters.condition]
          );
        }

        // Filter by price range
        if (filters.priceRange && filters.priceRange.length === 2) {
          const [min, max] = filters.priceRange;
          results = results.filter((p) => p.price >= min && p.price <= max);
        }

        // Filter by location
        if (filters.location && filters.location !== "all") {
          const locationMap = {
            bosso: "Bosso Campus",
            main: "Main Campus",
            "gidan-kwano": "Gidan Kwano",
            tunga: "Tunga",
            maitumbi: "Maitumbi",
          };
          results = results.filter(
            (p) => p.location === locationMap[filters.location]
          );
        }

        // Sort results
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case "newest":
              results.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
              break;
            case "price-low":
              results.sort((a, b) => a.price - b.price);
              break;
            case "price-high":
              results.sort((a, b) => b.price - a.price);
              break;
            case "popular":
              results.sort((a, b) => b.views - a.views);
              break;
            default:
              // relevance - keep current order
              break;
          }
        }

        resolve(results);
      }, 500);
    });
  },

  // Get products by category (no pagination)
  getProductsByCategory: (categoryId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (categoryId === "all") {
          resolve([...allProducts]);
        } else {
          const results = allProducts.filter((p) => p.category === categoryId);
          resolve(results);
        }
      }, 300);
    });
  },

  // Get trending products (most viewed)
  getTrendingProducts: (limit = 6) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trending = [...allProducts]
          .sort((a, b) => b.views - a.views)
          .slice(0, limit);
        resolve(trending);
      }, 300);
    });
  },
};

// Named exports for convenience
export const getProductById = productsService.getProductById;
export const getAllProducts = productsService.getAllProducts;
export const searchProducts = productsService.searchProducts;

export default productsService;
