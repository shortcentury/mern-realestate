import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    regularPrice: {
      type: Number,
    },
    discountPrice: {
      type: Number,
    },
    bathrooms: {
      type: Number,
    },
    bedrooms: {
      type: Number,
    },
    furnished: {
      type: Boolean,
    },
    parking: {
      type: Boolean,
    },
    type: {
      type: String,
    },
    offer: {
      type: Boolean,
    },
    imageUrls: {
      type: Array,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
