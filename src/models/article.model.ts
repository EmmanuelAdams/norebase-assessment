import { Schema, Document, model } from 'mongoose';

export interface ArticleDocument extends Document {
  likes: number;
}

const ArticleSchema = new Schema<ArticleDocument>({
  likes: { type: Number, default: 0 },
});

export const Article = model<ArticleDocument>(
  'Article',
  ArticleSchema
);
