// controllers/auth.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/database.js";
import { stat } from "fs";

export const AuthController = {
  async register(req, res) {
    const { email, password } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      res.status(201).json({ message: "Usuário registrado com sucesso", user, status: 201 });
      console.log('deu certo');
    } catch (error) {
      res.status(500).json({ error: "Erro ao registrar usuário" });
      console.log(error);
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Usuário não encontrado" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Senha incorreta" });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.json({ message: "Login realizado com sucesso", token });
    } catch (error) {
      res.status(500).json({ error: "Erro ao realizar login" });
    }
  },
};
