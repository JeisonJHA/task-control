const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  chamadas++;
  console.log(`Chamadas executadas ${chamadas}`);
  next();
});

var projects = [];
var id = 0;
var chamadas = 0;

router
  .route("/projects")
  .post((req, res, next) => salvarProjeto(req, res, next))
  .get((req, res, next) => pegarProjetos(req, res, next));
router
  .route("/projects/:id")
  .put(testarIdExiste, (req, res, next) => alterarProjetos(req, res, next))
  .delete(testarIdExiste, (req, res, next) => deletarProjetos(req, res, next));
router.post("/projects/:id/tasks", testarIdExiste, (req, res, next) =>
  salvarTask(req, res, next)
);

function salvarProjeto(req, res, next) {
  let { title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  id++;
  projects.push(project);
  res.json(project);
}

function pegarProjetos(req, res, next) {
  res.json(projects);
}

function alterarProjetos(req, res, next) {
  const { title } = req.body;
  const { id } = req.params;
  const project = projects.find(p => p.id === parseInt(id));
  project.title = title;
  res.json(project);
}

function deletarProjetos(req, res, next) {
  const { id } = req.params;
  projects = projects.filter(p => p.id !== parseInt(id));
  res.send();
}

function salvarTask(req, res, next) {
  const { title } = req.body;
  const { id } = req.params;
  const project = projects.find(p => p.id === parseInt(id));
  project.tasks.push(title);
  res.json(project);
}

function testarIdExiste(req, res, next) {
  const { id } = req.params;
  const projeto = projects.find(p => p.id === parseInt(id));
  if (!projeto) {
    return res.status(400).json({ error: "Project do not exists." });
  }

  next();
}

module.exports = router;
