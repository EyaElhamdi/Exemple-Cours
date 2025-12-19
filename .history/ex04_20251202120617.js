// app.js
const express = require('express');
const app = express();

app.use(express.json());

// Middleware de validation des données produit
const validateProductData = (req, res, next) => {
  const { name, price } = req.body;

  // Vérification du champ "name"
  if (!name || typeof name !== 'string' || name.trim() === '') {
    const error = new Error("Le champ 'name' est requis et doit être une chaîne non vide.");
    error.status = 400;
    return next(error);
  }

  // Vérification du champ "price"
  if (price === undefined || typeof price !== 'number' || price <= 0) {
    const error = new Error("Le champ 'price' est requis et doit être un nombre positif.");
    error.status = 400;
    return next(error);
  }

  // Si tout est OK
  next();
};

// Route pour ajouter un produit
app.post('/add-product', validateProductData, (req, res) => {
  const { name, price } = req.body;

  res.json({
    message: 'Produit ajouté avec succès',
    product: {
      name,
      price
    }
  });
});

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log de l'erreur pour le débogage
  res.status(err.status || 500).json({
    message: err.message || 'Une erreur est survenue sur le serveur.'
  });
};

app.use(errorHandler);

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(Serveur démarré sur le port ${PORT});
});