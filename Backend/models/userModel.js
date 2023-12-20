const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
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
      minLength: [6, "Password must be uo to 6 characters"],
      // maxLength: [23, "Password must not be more then  23 characters"],
    },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default: "https://ionicframework.com/docs/img/demos/avatar.svg",
    },
    phone: {
      type: String,
      default: "+966",
    },
    bio: {
      type: String,
      maxLength: [250, "bio most not be more then 250 characters"],
      default: "bio",
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt passeword
userSchema.pre("save", async function (next) {
  if(!this.isModified("password")){
    return next()
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hasedPassword = await bcrypt.hash(this.password, salt);
  this.password = hasedPassword
  next()
});

const User = mongoose.model("User", userSchema);

module.exports = User;
