import mongoose, {Schema} from 'mongoose';

const categoriaSchema = new Schema({
    name: { type: String, maxlength: 50, uique: true, required: true},
    description: { type: String, maxlength: 255 },
    status: { type: Number, default: 1},
    createdAt: { type: Date, default: Date.now }
});

const Categoria = mongoose.model('categoria', categoriaSchema);

export default Categoria;