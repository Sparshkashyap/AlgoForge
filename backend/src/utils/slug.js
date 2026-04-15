import slugify from "slugify";

export const generateProblemSlug = (title) => {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
};