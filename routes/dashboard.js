const express = require("express");
const router = express.Router();
const multer  = require('multer');
const upload = multer();

const entry_controller = require("../controllers/entryController");

// display the user's entries with GET
router.get("/:userid", entry_controller.display_entries_page)

// POST a new entry
router.post("/:userid", upload.none(), entry_controller.validate_entry, entry_controller.create_entry)

// copy an entry with POST
router.post("/duplicate/:userid", upload.none(), entry_controller.copy_entry)

// edit/update an entry with PUT
router.put("/:userid/:entryid", upload.none(), entry_controller.validate_entry, entry_controller.update_entry)

// DELETE an entry
router.delete("/:entryid", entry_controller.delete_entry)

module.exports = router;