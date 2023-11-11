import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setshowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const dispatch = useDispatch();

  // service firebase.storage {
  //   match /b/{bucket}/o {
  //     match /{allPaths=**} {
  //       allow read;
  //       allow write: if request.resource.size < 2 * 1024 * 1024 &&
  //       request.resource.contentType.matches('image/.*');

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = file.name + new Date().getTime();
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setfileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOutUser = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setshowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setshowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setshowListingsError(true);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          hidden
          type="file"
          ref={fileRef}
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser.avatar}
          alt="profile picture"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-error">
              Error Image upload! Has to be less than 2 mb!
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-success">{`Uploading ${filePerc} %`}</span>
          ) : filePerc === 100 ? (
            <span className="text-success">Succesfully uploded!</span>
          ) : (
            <span></span>
          )}
        </p>
        <input
          id="username"
          type="text"
          placeholder="Username..."
          defaultValue={currentUser.username}
          className="input-primary border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          id="email"
          type="email"
          defaultValue={currentUser.email}
          placeholder="Email..."
          className="input-primary border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          id="password"
          type="password"
          placeholder="Password..."
          className="input-primary border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="btn btn-primary p-3 hover:underline"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to={"/create"}
          className="btn btn-success rounded-lg uppercase hover:underline"
        >
          Create Listing
        </Link>
        <button
          type="button"
          disabled={loading}
          onClick={handleShowListings}
          className="btn btn-success rounded-lg uppercase hover:underline"
        >
          Show Listings
        </button>
        <p className="text-error font-semibold text-center">
          {showListingsError ? "Erro showing Listings!" : ""}
        </p>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="font-semibold text-error cursor-pointer hover:underline"
        >
          Delete account
        </span>
        <span
          onClick={handleSignOutUser}
          className="font-semibold text-error cursor-pointer hover:underline"
        >
          Sign out
        </span>
      </div>
      <div className="">
        <p className="text-error font-semibold text-center">
          {error ? error : ""}
        </p>
        <p className="text-success font-semibold text-center">
          {updateSuccess ? "User updated succesfully!" : ""}
        </p>
      </div>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing.id}
              className="gap-4 border rounded-lg p-3 flex justify-between items-center"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-24 w-24 rounded-lg"
                />
              </Link>
              <Link
                className="font-semibold hover:underline truncate flex-1 "
                to={`/listing/${listing._id}`}
              >
                <p className="">{listing.name}</p>
              </Link>
              <div className=" flex flex-col items-center gap-2">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="w-20 btn-error uppercase hover:underline rounded-lg btn-xs sm:btn-sm"
                >
                  Delete
                </button>
                <Link to={`/listing/update/${listing._id}`}>
                  <button className="w-20 btn-success uppercase hover:underline rounded-lg btn-xs sm:btn-sm">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
