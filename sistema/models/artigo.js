import mongoose, { Schema } from 'mongoose';

const artigoSchema = new Schema({
    category: { type: Schema.ObjectId, ref: 'categoria' },
    code: { type: String, maxlength: 64 },
    name: { type: String, maxlength: 50, unique: true, required: true },
    description: { type: String, maxlength: 255 },
    price_shell: { type: Number, required: true },
    stock: { type: Number, required: true },
    status: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
});

const Artigo = mongoose.model('artigo', artigoSchema);
export default Artigo;