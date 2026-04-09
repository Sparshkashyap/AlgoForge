import slugify from "slugify";

export const makeSlug = (value) => {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true
  });
};