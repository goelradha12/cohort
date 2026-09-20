// Load environment variables as early as possible. This module is imported
// first in index.js (before any route/controller/util imports) so that
// process.env is populated before other modules initialize. ES module imports
// are evaluated top-to-bottom, so a side-effect import here runs before the rest.
import dotenv from "dotenv";

dotenv.config();
