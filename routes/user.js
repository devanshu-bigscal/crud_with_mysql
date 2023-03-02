const router = require("express")();
const { createUser, getAllUsers, getUserById, deleteUserById, updateUserById, validationCreate, login, authenticate, getUserByAuthentication } = require("../controllers/user");

router.post("/", validationCreate, createUser);
router.get("/", authenticate, getAllUsers)
router.get("/:id", getUserById)
router.delete("/:id", deleteUserById)
router.put("/:id", updateUserById)
router.post("/login", login)
router.get("/auth/user", authenticate, getUserByAuthentication)
module.exports = router;
