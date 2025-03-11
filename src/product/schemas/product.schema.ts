import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  category?: string;

  @Prop()
  price?: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
