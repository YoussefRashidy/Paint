import { ShapeDto } from './shape.dto';

export interface RectangleDto extends ShapeDto {
  type: 'rectangle' | 'square';
  rx?: number;
  ry?: number;
}
