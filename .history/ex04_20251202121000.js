const express = require("express");
const app = express();

// Middlewares de base
app.use(express.json({ limit: "10kb" }));

// Validation améliorée
const validateProductData = (req, res, next) => {
  const { name, price, description } = req.body;

  // Validation du nom
  if (!name || typeof name !== "string") {
    const error = new Error(
      "Le champ 'name' est requis et doit être une chaîne de caractères."
    );
    error.status = 400;
    return next(error);
  }

  const trimmedName = name.trim();
  if (trimmedName === "") {
    const error = new Error("Le champ 'name' ne peut pas être vide.");
    error.status = 400;
    return next(error);
  }

  if (trimmedName.length > 100) {
    const error = new Error("Le nom ne peut pas dépasser 100 caractères.");
    error.status = 400;
    return next(error);
  }

  // Validation du prix
  if (price === undefined || price === null) {
    const error = new Error("Le champ 'price' est requis.");
    error.status = 400;
    return next(error);
  }

  if (typeof price !== "number" || isNaN(price)) {
    const error = new Error("Le champ 'price' doit être un nombre valide.");
    error.status = 400;
    return next(error);
  }

  if (price <= 0) {
    const error = new Error("Le champ 'price' doit être un nombre positif.");
    error.status = 400;
    return next(error);
  }

  if (price > 1000000) {
    const error = new Error("Le prix ne peut pas dépasser 1,000,000.");
    error.status = 400;
    return next(error);
  }

  // Validation optionnelle de la description
  if (description && typeof description !== "string") {
    const error = new Error(
      "Le champ 'description' doit être une chaîne de caractères."
    );
    error.status = 400;
    return next(error);
  }

  // Nettoyer les données
  req.body.name = trimmedName;
  req.body.price = parseFloat(price.toFixed(2)); // Arrondir à 2 décimales

  next();
};

// Routes
app.post("/add-product", validateProductData, (req, res) => {
  const { name, price, description } = req.body;

  // Ici, vous ajouteriez normalement le produit à une base de données
  const product = {
    id: Date.now(), // ID temporaire
    name,
    price,
    description: description || null,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json({
    success: true,
    message: "Produit ajouté avec succès",
    data: product,
  });
});

// Route 404
app.use((req, res, next) => {
  const error = new Error(
    `Route non trouvée - ${req.method} ${req.originalUrl}`
  );
  error.status = 404;
  next(error);
});

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;

  // Log détaillé en développement
  console.error({
    status: statusCode,
    message: err.message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });

  // Réponse au client
  res.status(statusCode).json({
    success: false,
    message: err.message || "Une erreur est survenue sur le serveur.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

app.use(errorHandler);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
