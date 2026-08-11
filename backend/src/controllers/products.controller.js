const prisma = require('../config/prisma');
const { uploadImage, deleteImage } = require('../services/cloudinary.service');
const parseBoolean = require('../utils/parseBoolean');

async function getProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener los productos' });
  }
}

function parsePrice(price) {
  const parsedPrice = Number(price);
  return Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : null;
}

async function createProduct(req, res) {
  const { name, desc, price, available } = req.body;
  const parsedPrice = parsePrice(price);
  const isAvailable = parseBoolean(available, true);

  if (!name?.trim() || !desc?.trim() || parsedPrice === null) {
    return res.status(400).json({
      error: 'El nombre, descripción y precio válido son obligatorios',
    });
  }

  if (isAvailable === null) {
    return res.status(400).json({
      error: 'El campo available debe ser true o false',
    });
  }

  if (!req.file) {
    return res.status(400).json({
      error: 'La imagen del producto es obligatoria',
    });
  }

  try {
    const imageResult = await uploadImage(req.file.buffer);

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        desc: desc.trim(),
        price: parsedPrice,
        image: imageResult.secure_url,
        imagePublicId: imageResult.public_id,
        available: isAvailable,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear el producto' });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, desc, price, available } = req.body;
  const parsedPrice = parsePrice(price);
  const parsedAvailable = parseBoolean(available, undefined);

  if (!name?.trim() || !desc?.trim() || parsedPrice === null) {
    return res.status(400).json({
      error: 'El nombre, descripción y precio válido son obligatorios',
    });
  }

  if (parsedAvailable === null) {
    return res.status(400).json({
      error: 'El campo available debe ser true o false',
    });
  }

  try {
    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    let image = existing.image;
    let imagePublicId = existing.imagePublicId;
    let uploadedImage = null;

    if (req.file) {
      uploadedImage = await uploadImage(req.file.buffer);
      image = uploadedImage.secure_url;
      imagePublicId = uploadedImage.public_id;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        desc: desc.trim(),
        price: parsedPrice,
        image,
        imagePublicId,
        ...(parsedAvailable !== undefined ? { available: parsedAvailable } : {}),
      },
    });

    if (uploadedImage && existing.imagePublicId) {
      try {
        await deleteImage(existing.imagePublicId);
      } catch (cloudinaryError) {
        console.error('No se pudo eliminar la imagen anterior de Cloudinary:', cloudinaryError);
      }
    }

    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el producto' });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await prisma.product.delete({ where: { id } });

    if (existing.imagePublicId) {
      try {
        await deleteImage(existing.imagePublicId);
      } catch (cloudinaryError) {
        console.error('El producto fue eliminado, pero no se pudo eliminar su imagen de Cloudinary:', cloudinaryError);
      }
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    if (error?.code === 'P2003') {
      return res.status(409).json({
        error: 'No se puede eliminar el producto porque tiene pedidos asociados. Desactívalo en su lugar.',
      });
    }

    return res.status(500).json({ error: 'Error al eliminar el producto' });
  }
}

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
