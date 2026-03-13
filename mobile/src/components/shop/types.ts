import type { Product } from '../../types/product';
import type { Banner } from '../../types/banner';
import type { QuickCategory } from '../../types/category';

export interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToCart?: (product: Product) => void;
}

export interface BannerCarouselProps {
  banners: Banner[];
  onBannerPress?: (banner: Banner) => void;
}

export interface QuickCategoryGridProps {
  categories: QuickCategory[];
  onPress?: (category: QuickCategory) => void;
}

export interface SectionHeaderProps {
  title: string;
  showMore?: boolean;
  onMore?: () => void;
}
