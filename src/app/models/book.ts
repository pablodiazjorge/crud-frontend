export interface Book {
  id?: number;
  title: string;
  author: string;
  pages: number;
  price: number;
}

export interface BookWithImageDTO {
  id: number;
  title: string;
  author: string;
  pages: number;
  price: number;
  imageId: number | null;
  imageName: string | null;
  imageUrl: string | null;
  imageImageId: string | null;
}