
import { ShapeDto } from './shape.dto';

export interface PolygonDto extends ShapeDto {
  type: 'polygon' | 'triangle';

  points?: { x: number; y: number }[];
}
