import {
  exportProblemsCsvService,
  exportUsersCsvService,
} from "../services/export.service.js";

export const exportUsersCsvController = async (_req, res, next) => {
  try {
    const csv = await exportUsersCsvService();

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="users.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

export const exportProblemsCsvController = async (_req, res, next) => {
  try {
    const csv = await exportProblemsCsvService();

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="problems.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};