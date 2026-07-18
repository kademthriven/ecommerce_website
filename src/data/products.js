function createProductViews(imageId) {
  const base = `https://images.unsplash.com/${imageId}?auto=format&fit=crop&q=85`

  return [
    { src: `${base}&w=1000`, label: 'Front view', position: 'center', scale: 1 },
    { src: `${base}&w=1000&crop=top`, label: 'Detail view', position: 'center top', scale: 1.35 },
    { src: `${base}&w=1000&crop=bottom`, label: 'Lifestyle view', position: 'center bottom', scale: 1.35 },
  ]
}

export const products = [
  {
    id: 'aurora-headphones',
    title: 'Aurora Headphones',
    category: 'Audio',
    badge: 'Bestseller',
    price: 89,
    description:
      'Immersive wireless sound, cloud-soft ear cushions, and up to 30 hours of battery life for workdays and weekends.',
    images: createProductViews('photo-1505740420928-5e560c06d30e'),
    rating: 4.8,
    reviews: [
      {
        id: 'aurora-1',
        author: 'Maya R.',
        rating: 5,
        title: 'Comfortable all day',
        comment: 'The sound is clear and balanced, and they stay comfortable through a full workday.',
        date: 'June 18, 2026',
      },
      {
        id: 'aurora-2',
        author: 'Jordan K.',
        rating: 4,
        title: 'Excellent everyday headphones',
        comment: 'Easy pairing, long battery life, and a clean design that goes with everything.',
        date: 'May 27, 2026',
      },
    ],
  },
  {
    id: 'stride-sneakers',
    title: 'Stride Sneakers',
    category: 'Footwear',
    badge: 'New',
    price: 74,
    description:
      'Lightweight everyday sneakers with breathable panels, responsive cushioning, and a versatile low-profile shape.',
    images: createProductViews('photo-1542291026-7eec264c27ff'),
    rating: 4.5,
    reviews: [
      {
        id: 'stride-1',
        author: 'Alex T.',
        rating: 5,
        title: 'Light and supportive',
        comment: 'They fit true to size and feel supportive without being heavy.',
        date: 'July 2, 2026',
      },
      {
        id: 'stride-2',
        author: 'Sam P.',
        rating: 4,
        title: 'Great everyday pair',
        comment: 'The color is even better in person and they are easy to style.',
        date: 'April 14, 2026',
      },
    ],
  },
  {
    id: 'meridian-watch',
    title: 'Meridian Watch',
    category: 'Accessories',
    price: 129,
    description:
      'A refined everyday watch with a minimalist dial, durable steel case, and soft genuine leather strap.',
    images: createProductViews('photo-1523275335684-37898b6baf30'),
    rating: 4.7,
    reviews: [
      {
        id: 'meridian-1',
        author: 'Priya S.',
        rating: 5,
        title: 'Simple and elegant',
        comment: 'The dial is easy to read and the profile is slim enough for daily wear.',
        date: 'June 30, 2026',
      },
      {
        id: 'meridian-2',
        author: 'Chris L.',
        rating: 4,
        title: 'Feels premium',
        comment: 'Beautifully made, securely packaged, and the leather softened quickly.',
        date: 'March 21, 2026',
      },
    ],
  },
  {
    id: 'focus-camera',
    title: 'Focus Mini Camera',
    category: 'Tech',
    badge: 'Staff pick',
    price: 149,
    description:
      'A compact travel camera with intuitive controls and rich color, made for capturing moments without the bulk.',
    images: createProductViews('photo-1526170375885-4d8ecf77b99f'),
    rating: 4.9,
    reviews: [
      {
        id: 'focus-1',
        author: 'Taylor N.',
        rating: 5,
        title: 'Perfect travel companion',
        comment: 'Small enough to carry everywhere and the controls are refreshingly simple.',
        date: 'July 8, 2026',
      },
      {
        id: 'focus-2',
        author: 'Devin A.',
        rating: 5,
        title: 'Fun to use',
        comment: 'It makes taking photos feel intentional again, and the image quality is lovely.',
        date: 'May 9, 2026',
      },
    ],
  },
].map((product) => ({
  ...product,
  imageUrl: product.images[0].src,
}))

export function findProductById(productId) {
  return products.find((product) => product.id === productId)
}
