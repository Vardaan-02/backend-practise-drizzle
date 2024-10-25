import { Router } from "express";
import get_post from "../controllers/post/get_post";
import create_post from "../controllers/post/create_post";
import { isAuthenticated } from "../middleware/auth.middleware";
import get_user_post from "../controllers/post/get_user_post";
import create_tag from "../controllers/post/create_tag";
import get_tag from "../controllers/post/get_tag";
import get_post_by_tag from "../controllers/post/get_post_by_tag";

const router = Router();

router.get("/", isAuthenticated, get_post);
router.post("/", isAuthenticated, create_post);
router.get("/user-post", isAuthenticated, get_user_post);
router.post("/create-tag", isAuthenticated, create_tag);
router.get("/get-tag", isAuthenticated, get_tag);
router.get("/get-post-by-tag/:tag", get_post_by_tag);

export default router;
