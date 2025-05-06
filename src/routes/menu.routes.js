import { Router } from "express";
import { MenuController } from "../controllers/menu.controller.js";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Aplicando o middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas para MenuItem
router.post("/", MenuController.create);
router.get("/", MenuController.getAll);
router.get("/:id", MenuController.getById);
router.put("/:id", MenuController.update);
router.delete("/:id", MenuController.delete);

// Rotas para Cardápio
router.post("/cardapio", MenuController.createCardapio);
router.get("/cardapio/todos", MenuController.getCardapios);
router.get("/cardapio/:id", MenuController.getCardapioById);
router.put("/cardapio/:id", MenuController.updateCardapio);
router.delete("/cardapio/:id", MenuController.deleteCardapio);
router.get("/cardapio/:cardapioId/itens", MenuController.getItensByCardapio);

// Rota para receber a imagem
router.post("/upload", upload.single("image"), MenuController.uploadImage);

export default router;
