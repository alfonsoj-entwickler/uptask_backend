import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("The name is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("The password is too simple"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(
        '"New Password" and "Confirm Password" fields are different',
      );
    }
    return true;
  }),
  body("email").isEmail().withMessage("The email is not a valid email address"),
  handleInputErrors,
  AuthController.createAccount,
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("The token is empty"),
  handleInputErrors,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email").isEmail().withMessage("The email is not a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("The password is empty"),
  handleInputErrors,
  AuthController.login
);

router.post(
  "/request-code",
  body("email").isEmail().withMessage("The email is not a valid email address"),
  handleInputErrors,
  AuthController.requestConfirmationCode
);

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("The email is not a valid email address"),
  handleInputErrors,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("The token is empty"),
  handleInputErrors,
  AuthController.validateToken
);

router.post(
  "/update-password/:token",
  param('token').isNumeric().withMessage('token not valid'),
  body("password")
    .isLength({ min: 8 })
    .withMessage("The password is too simple"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(
        '"New Password" and "Confirm Password" fields are different',
      );
    }
    return true;
  }),
  handleInputErrors,
  AuthController.updatePasswordWithToken
);

export default router;
