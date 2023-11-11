import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    city: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
      }

      setFormData(data);
    };

    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 11) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed! (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can upload only 10 images per listing!");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = file.name + new Date().getTime();
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image!");
      if (+formData.regularPrice <= +formData.discountPrice)
        return setError(
          "Discounted price must be lower than the Regular Price!"
        );
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form onSubmit={handleSubmit} className="">
        <div className="gap-4 flex flex-col">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <input
              id="name"
              type="text"
              className="border p-3 input-primary rounded-lg"
              placeholder="Name..."
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              id="description"
              type="text"
              className="border p-3 textarea-primary rounded-lg"
              placeholder="Description..."
              onChange={handleChange}
              value={formData.description}
            />
            <input
              id="address"
              type="text"
              className="border p-3 input-primary rounded-lg"
              placeholder="Address..."
              onChange={handleChange}
              value={formData.address}
            />
            <input
              id="city"
              type="text"
              className="border p-3 input-primary rounded-lg"
              placeholder="City..."
              onChange={handleChange}
              value={formData.city}
            />
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.type === "sale"}
                type="checkbox"
                id="sale"
                className="input-primary w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.type === "rent"}
                type="checkbox"
                id="rent"
                className="input-primary w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.parking}
                type="checkbox"
                id="parking"
                className="input-primary w-5"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.furnished}
                type="checkbox"
                id="furnished"
                className="input-primary w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.offer}
                type="checkbox"
                id="offer"
                className="input-primary w-5"
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.bedrooms}
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                className="input-primary border p-3 rounded-lg w-24"
              />
              <p>Bedrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.bathrooms}
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                className="input-primary border p-3 rounded-lg w-24"
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.regularPrice}
                type="number"
                id="regularPrice"
                min="0"
                max="99999999"
                className="input-primary border p-3 rounded-lg w-24"
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-sm">(€ per month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  onChange={handleChange}
                  value={formData.discountPrice}
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="99999999"
                  className="input-primary border p-3 rounded-lg"
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-sm">(€ per month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <p className="font-semibold p-3">
            Images
            <span className="text-info italic text-xs pl-3">
              The first Image will be the cover (max 10)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-2 border rounded-lg w-full input-primary "
            />
            <button
              onClick={handleImageSubmit}
              type="button"
              className="p-3 btn btn-success rounded-lg uppercase hover:underline disabled:opacity-80"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
        <p className="text-error font-semibold text-center p-2">
          {imageUploadError && imageUploadError}
        </p>
        {formData.imageUrls.length > 0 &&
          formData.imageUrls.map((url, index) => (
            <div
              key={url}
              className="flex justify-between p-3 border items-center"
            >
              <img
                src={url}
                alt="Listing image"
                className="w-20 h-20 object-contain rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                type="button"
                className="btn-sm btn-error rounded-lg uppercase hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        {error && (
          <p className="text-error font-semibold text-center">{error}</p>
        )}
        <div className="flex flex-col items-center">
          <button
            disabled={loading || uploading}
            className="mt-8 w-3/4 btn btn-success rounded-lg uppercase hover:underline disabled:opacity-80"
          >
            {loading ? "Creating..." : "Update Listing"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
