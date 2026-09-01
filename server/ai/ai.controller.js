// Step 1: Import service
import { generateAnswer } from "./answer/generateAnswer.service.js";

// Step 2: AI Chat Controller
export const askAI = async (req, res, next) => {
  try {

    const { question } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    const result = await generateAnswer(question);

    return res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {
    next(error);
  }
};