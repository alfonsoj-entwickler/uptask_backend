import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error("User exists");
        return res.status(409).json({ error: error.message });
      }

      const user = new User(req.body);
      // hash password
      user.password = await hashPassword(password);

      // generate token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // send email
      await AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      // save user and token
      await Promise.allSettled([user.save(), token.save()]);

      res.send("Your account was created, please confirm via email");
    } catch (error) {
      //console.error(error)
      res.status(500).json({ error: "Auh: There is a error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token not valid");
        return res.status(404).json({ error: error.message });
      }
      const user = await User.findById(tokenExists.user);
      if (!user) {
        const error = new Error("User not exists");
        return res.status(404).json({ error: error.message });
      }

      user.confirmed = true;
      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

      return res.send("Account confirmed");
    } catch (error) {
      res.status(500).json({ error: "Confirm Email: There is a error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("User not exists");
        return res.status(404).json({ error: error.message });
      }

      if (!user.confirmed) {
        // generate token
        const token = new Token();
        token.token = generateToken();
        token.user = user.id;
        await token.save();

        // send email
        await AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error("User not exists - We send a new email");
        return res.status(404).json({ error: error.message });
      }

      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("Password falsch");
        return res.status(404).json({ error: error.message });
      }

      const token = generateJWT({id: user.id });
      res.send(token);
    } catch (error) {
      res.status(500).json({ error: "There is a error" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const userExists = await User.findOne({ email });
      if (!userExists) {
        const error = new Error("user not registered");
        return res.status(404).json({ error: error.message });
      }

      if (userExists.confirmed) {
        const error = new Error("The user already is confirmed");
        return res.status(403).json({ error: error.message });
      }

      // generate token
      const token = new Token();
      token.token = generateToken();
      token.user = userExists.id;

      // send email
      await AuthEmail.sendConfirmationEmail({
        email: userExists.email,
        name: userExists.name,
        token: token.token,
      });

      // save token
      await token.save();

      res.send("Created a new token, please confirm via email");
    } catch (error) {
      //console.error(error)
      res.status(500).json({ error: "Auh: There is a error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const userExists = await User.findOne({ email });
      if (!userExists) {
        const error = new Error("user not registered");
        return res.status(404).json({ error: error.message });
      }

      // generate token
      const token = new Token();
      token.token = generateToken();
      token.user = userExists.id;

      // send email
      await AuthEmail.sendPasswordResetToken({
        email: userExists.email,
        name: userExists.name,
        token: token.token,
      });

      // save token
      await token.save();

      res.send("Please, create a new password");
    } catch (error) {
      //console.error(error)
      res.status(500).json({ error: "Auh: There is a error" });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token not valid");
        return res.status(404).json({ error: error.message });
      }
      const user = await User.findById(tokenExists.user);
      if (!user.confirmed) {
        const error = new Error("User not exists");
        return res.status(404).json({ error: error.message });
      }

      return res.send("Token validated, create a new password");
    } catch (error) {
      res.status(500).json({ error: "Confirm Email: There is a error" });
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token not valid");
        return res.status(404).json({ error: error.message });
      }
      const user = await User.findById(tokenExists.user);
      if (!user.confirmed) {
        const error = new Error("User not exists");
        return res.status(404).json({ error: error.message });
      }

      const { password } = req.body;
      // hash password
      user.password = await hashPassword(password);
       
      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      
      return res.send("updated password");
    } catch (error) {
      res.status(500).json({ error: "Confirm Email: There is a error" });
    }
  };
}
