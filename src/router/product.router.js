const router = require("express").Router();

router.get("/products", (req, res) => {
    res.send("Im a router");
});

module.exports = router;