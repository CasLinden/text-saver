const Entry = require("../models/entry");
const passport = require("passport");
const { body, check, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// get user's entries and stringify ID values, for passsing them to ejs and usage them in our scripts
async function getAndStringifyUserEntries (userId){
  console.log(userId)
   const userEntries = await Entry.find( {user: userId} );
   const stringifiedEntries = userEntries.map(entry => {
       const stringifiedEntry = entry.toObject({ virtuals: true });
       stringifiedEntry._id = stringifiedEntry._id.toString();
       stringifiedEntry.user = stringifiedEntry.user.toString();
       return stringifiedEntry
   });
   return stringifiedEntries;
}

exports.display_entries_page = asyncHandler(async (req, res, next) => {
  const userId = req.params.userid;  // Get the user ID from the route parameter
  const entries = await getAndStringifyUserEntries(userId)
  let context = {
     newEntry: {},
     newEntryErrors: [],
     entries
   };
 res.render("dashboard", context);
});

// validate new entry POST
exports.validate_entry = [
  
  body("entry")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Entry field cannot be empty.")
  .escape(),
  body("entry-title")
  .optional()
  .isLength({ max: 35 })
  .withMessage("Entry title must be less than 25 characters.")
  .trim()
  .escape(),
  
  async (req, res, next) => {
    console.log("Req Body in validate_entry:", req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
   
      res.status(400).json({
        success: false,
        errors: errors.array(),
        entryContent: req.body.entry,
        entryTitle: req.body['entry-title']
      });

    } else {
      next();
    }
  },
];

// handle new entry POST
exports.create_entry = asyncHandler(async (req, res) => {
   const { entry, 'entry-title': entryTitle } = req.body;
   console.log(res.locals.currentUser)
   const newEntry = new Entry({
       entryContent: entry,
       entryTitle: entryTitle,
       user: res.locals.currentUser._id || req.params.userid
   });
   await newEntry.save();
   res.json({ success: true, redirectUrl: `/dashboard/${res.locals.currentUser._id || req.params.userid}` });
});

// handle copy entry POST
exports.copy_entry = asyncHandler(async (req, res) => {
  const { entry, 'entry-title': originalEntryTitle } = req.body;
  const entryTitle = 'Copy of ' + originalEntryTitle;
  const newEntry = new Entry({
    entryContent: entry,
    entryTitle: entryTitle,
    user: res.locals.currentUser._id
  });
  await newEntry.save();
  res.json({ success: true, redirectUrl: `/dashboard/${res.locals.currentUser._id}` });
});


// handle edit/update entry PUT
exports.update_entry = asyncHandler(async (req, res) => {
    const { userid, entryid } = req.params; 
    const { entry, 'entry-title': entryTitle } = req.body;

    const existingEntry = await Entry.findOne({ _id: entryid, user: userid });

    if (!existingEntry) {
        return res.status(404).json({ success: false, message: 'Entry not found.' });
    }

    existingEntry.entryContent = entry;
    existingEntry.entryTitle = entryTitle;
    existingEntry.lastEdited = new Date()

    await existingEntry.save();
    console.log('about to send res.json from update_entry')
    res.json({ success: true, redirectUrl: `/dashboard/${userid}` });
});

// handle entry delete on POST
exports.delete_entry = asyncHandler(async (req, res, next) => {
  console.log(req.params.entryid)
  const entryId = req.params.entryid
  await Entry.findByIdAndRemove(entryId)
  res.json({success: true})
});