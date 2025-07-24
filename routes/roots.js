const express = require("express");
const { renderRoot } = require("../controllers/roots");
const router = express.Router();

router
    .route("/")
    .get(renderRoot)


module.exports = router;