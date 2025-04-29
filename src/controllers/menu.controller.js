import { MenuRepository } from "../repositories/menu.repository.js";
import { processImage } from "../services/openai.service.js";
import fs from "fs";

export const MenuController = {
  async create(req, res) {
    try {
      const item = await MenuRepository.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: "Erro ao inserir item" });
    }
  },

  async getAll(req, res) {
    const items = await MenuRepository.getAll();
    //res.json(items);
    res.send("testando")
  },

  async getById(req, res) {
    const item = await MenuRepository.getById(parseInt(req.params.id));
    item ? res.json(item) : res.status(404).json({ error: "Item não encontrado" });
  },

  async update(req, res) {
    try {
      const updatedItem = await MenuRepository.update(parseInt(req.params.id), req.body);
      res.json(updatedItem);
    } catch {
      res.status(500).json({ error: "Erro ao atualizar" });
    }
  },

  async delete(req, res) {
    try {
      await MenuRepository.delete(parseInt(req.params.id));
      res.json({ message: "Item deletado" });
    } catch {
      res.status(500).json({ error: "Erro ao deletar" });
    }
  },

  async uploadImage(req, res) {
    console.log('aqqqqqq')
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada" });
      }

      const imagePath = req.file.path;
      console.log(`Imagem recebida: ${imagePath}`);

      // Processa a imagem usando OpenAI
      const responseData = await processImage(imagePath);
      const extractedData = JSON.parse(responseData); // Converte JSON da OpenAI

      // Salva os dados no banco de dados
      for (const category of extractedData) {
        for (const product of category.products) {
          await MenuRepository.create({
            tipo: "Produto",
            nome: product.product_name,
            descricao: product.description || "",
            valor: product.value || 0,
            valorPromocional: product.promotion_value || 0,
            tipoComplemento: "",
            qtdMinima: 0,
            qtdMaxima: 0,
          });
        }
      }

      // Deleta a imagem após o processamento
      fs.unlinkSync(imagePath);

      res.json({ message: "Imagem processada e dados salvos com sucesso!" });
    } catch (error) {
      console.error("Erro no processamento da imagem:", error);
      res.status(500).json({ error: "Erro ao processar a imagem" });
    }
  },
};
