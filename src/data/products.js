const albumImageBaseUrl = 'https://prasadyash2411.github.io/ecom-website/img'

function createAlbumViews(albumNumber) {
  const src = `${albumImageBaseUrl}/Album%20${albumNumber}.png`

  return [
    { src, label: 'Full album cover', position: 'center', scale: 1 },
    { src, label: 'Upper artwork detail', position: 'center top', scale: 1.55 },
    { src, label: 'Lower artwork detail', position: 'center bottom', scale: 1.55 },
  ]
}

export const products = [
  {
    id: 'colors',
    title: 'Colors',
    price: 100,
    description:
      'A vivid limited-edition album pressing with expressive artwork and a warm, energetic sound.',
    images: createAlbumViews(1),
    rating: 4.8,
    reviews: [
      {
        id: 'colors-1',
        author: 'Maya R.',
        rating: 5,
        title: 'Beautiful artwork and sound',
        comment: 'The colors look even better in person and the pressing sounds wonderfully clear.',
        date: 'June 18, 2026',
      },
      {
        id: 'colors-2',
        author: 'Jordan K.',
        rating: 4,
        title: 'A great collector edition',
        comment: 'Arrived safely and the cover detail is excellent. It has become a display favorite.',
        date: 'May 27, 2026',
      },
    ],
  },
  {
    id: 'black-and-white-colors',
    title: 'Black and white Colors',
    price: 50,
    description:
      'A monochrome album edition that pairs bold contrast with a clean, timeless presentation.',
    images: createAlbumViews(2),
    rating: 4.5,
    reviews: [
      {
        id: 'black-white-1',
        author: 'Alex T.',
        rating: 5,
        title: 'Minimal and striking',
        comment: 'The black-and-white cover is sharp and the album was packaged very carefully.',
        date: 'July 2, 2026',
      },
      {
        id: 'black-white-2',
        author: 'Sam P.',
        rating: 4,
        title: 'Excellent value',
        comment: 'A strong release at this price. The music and physical presentation are both solid.',
        date: 'April 14, 2026',
      },
    ],
  },
  {
    id: 'yellow-and-black-colors',
    title: 'Yellow and Black Colors',
    price: 70,
    description:
      'A high-contrast yellow and black release created for listeners who enjoy bold cover design.',
    images: createAlbumViews(3),
    rating: 4.7,
    reviews: [
      {
        id: 'yellow-black-1',
        author: 'Priya S.',
        rating: 5,
        title: 'The cover really stands out',
        comment: 'It looks fantastic on the shelf and every track plays cleanly from start to finish.',
        date: 'June 30, 2026',
      },
      {
        id: 'yellow-black-2',
        author: 'Chris L.',
        rating: 4,
        title: 'Very happy with it',
        comment: 'Good print quality, vibrant yellow tones, and quick delivery.',
        date: 'March 21, 2026',
      },
    ],
  },
  {
    id: 'blue-color',
    title: 'Blue Color',
    price: 100,
    description:
      'A cool-toned collector album with layered blue artwork and a polished listening experience.',
    images: createAlbumViews(4),
    rating: 4.9,
    reviews: [
      {
        id: 'blue-1',
        author: 'Taylor N.',
        rating: 5,
        title: 'My favorite of the collection',
        comment: 'The blue artwork has lots of subtle detail and the audio quality is excellent.',
        date: 'July 8, 2026',
      },
      {
        id: 'blue-2',
        author: 'Devin A.',
        rating: 5,
        title: 'Premium collector piece',
        comment: 'A beautiful release with sturdy packaging. I would absolutely recommend it.',
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
