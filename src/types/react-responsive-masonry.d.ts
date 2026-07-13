declare module "react-responsive-masonry" {
  import type { ComponentType, CSSProperties, ReactNode } from "react";

  interface MasonryProps {
    children?: ReactNode;
    columnsCount?: number;
    columnsCountBreakPoints?: Record<number, number>;
    gutter?: string;
    className?: string;
    style?: CSSProperties;
  }

  const Masonry: ComponentType<MasonryProps>;

  export default Masonry;
}
