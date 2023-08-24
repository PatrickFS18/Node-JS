// routes/routes.js
const express = require('express');
const router = express.Router();
const myController = require("../controllers/mycontroller");

router.get("/",myController.home);

router.get("/listar", myController.listarEmpregados);

router.get('/search', myController.showAllQuestions);

router.post('/searchBy', myController.searchByName);
router.post("/adicionar",myController.adicionar);

module.exports = router;
