const express = require("express");
const app = express();

// Middleware pour analyser le corps de la requête en JSON
app.use(express.json());

// Middleware de validation des champs "username" et "password"
const validateUserFields = (req, res, next) => {
  const { username, password } = req.body;

  // Vérifie si les champs "username" et "password" sont présents
  if (!username || !password) {
    return res
      .status(400)
      .send('Erreur: Les champs "username" et "password" sont requis.');
  }

  // Passe au middleware ou route suivant
  next();
};

// Route d'exemple utilisant le middleware de validation
app.post("/login", validateUserFields, (req, res) => {
  res.send("Connexion réussie");
});

app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});
