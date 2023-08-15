const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const EntrySchema = new Schema({
  entryContent: { type: String, required: true },
  entryTitle: { type: String },
  entryDate: { type: Date, default: Date.now },
  lastEdited: { type: [Date] },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

// middleware to set the title if it isn't set
EntrySchema.pre('save', function (next) {
    if (!this.entryTitle) {
      this.entryTitle = this.entryContent.length > 25 ? this.entryContent.substring(0, 25) + '...' : this.entryContent;
    }
    next();
  });

  //format the date for our views
  EntrySchema.virtual("entryDateFormatted").get(function () {
    return this.entryDate ? DateTime.fromJSDate(this.entryDate).toFormat('HH:mm, dd LLLL yyyy') : '';
  });

module.exports = mongoose.model("Entry", EntrySchema);