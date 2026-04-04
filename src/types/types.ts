export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  reviewCount: number;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  coverImage: string;
  cuisine: string;
  priceRange: string;
  openingHours: { day: string; hours: string }[];
  phone: string;
  website: string;
  averageScore: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  userId: string;
  restaurantId: string;
  burgerName: string;
  caption: string;
  imageUrl: string;
  scores: {
    taste: number;
    texture: number;
    presentation: number;
  };
  overallScore: number;
  createdAt: string;
}