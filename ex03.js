const express = require("express");
const app = express();

app.use(express.json()); // Pour analyser le corps des requêtes JSON

// Middleware de validation de l'âge
const validateAge = (req, res, next) => {
  const { age } = req.body;

  if (age === undefined) {
    const error = new Error("L'âge n'est pas défini");
    error.status = 400;
    return next(error);
  }

  if (age < 0) {
    // Génère une erreur si l'âge est négatif
    const error = new Error("L'âge ne peut pas être négatif.");
    error.status = 400;
    return next(error); // Passe l'erreur au middleware de gestion des erreurs
  }

  next(); // Si tout est OK, passe à la route suivante
};

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log de l'erreur pour le debug
  res.status(err.status || 500).json({
    message: err.message || "Une erreur est survenue sur le serveur.",
  });
};

// Route de test utilisant le middleware validateAge
app.post("/add-user", validateAge, (req, res) => {
  res.send("Utilisateur ajouté avec succès!");
});

// Utiliser le middleware de gestion des erreurs
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Serveur démarré sur le port 3000");
});
