const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
      name: {
        type: String,
        required: [true, "Please add a name"],
      },
      email: {
        type: String,
        required: [true, "Please add a email"],
        unique: true,
        trim: true,
        match: [
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Please enter a valid email",
        ],
      },
      password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be up to 6 characters"],
      },
      phone: {
        type: String,
        required: true,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
      street: {
        type: String,
        default: "",
      },
      apartment: {
        type: String,
        default: "",
      },
      zip: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    });

    
// Encrypt passeword
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hasedPassword = await bcrypt.hash(this.password, salt);
  this.password = hasedPassword;
  next();
});

userSchema.virtual('id').get(function () {
      return this._id.toHexString();
  });
  
userSchema.set('toJSON', {
      virtuals: true,
  });

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
