import multer from "multer";
import path from "path";

// Set up storage options with disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the destination exists or handle any errors
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // Adding a timestamp to avoid filename conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Add a file filter to restrict to images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG image files are allowed"), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Limit file size to 2MB
  },
  fileFilter: fileFilter,
});
