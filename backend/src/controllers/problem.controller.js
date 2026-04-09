import {
  listProblemsService,
  getProblemBySlugService,
  createProblemService
} from "../services/problem.service.js";
import { successResponse } from "../utils/response.js";

export const listProblemsController = async (req, res, next) => {
  try {
    const problems = await listProblemsService();
    return successResponse(res, problems, "Problems fetched");
  } catch (error) {
    next(error);
  }
};

export const getProblemBySlugController = async (req, res, next) => {
  try {
    const problem = await getProblemBySlugService(req.params.slug);
    return successResponse(res, problem, "Problem fetched");
  } catch (error) {
    next(error);
  }
};

export const createProblemController = async (req, res, next) => {
  try {
    const problem = await createProblemService(req.validated.body);
    return successResponse(res, problem, "Problem created", 201);
  } catch (error) {
    next(error);
  }
};