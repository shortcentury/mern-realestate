import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Signin from "./pages/signin/Signin.jsx";
import Signup from "./pages/signup/Signup.jsx";
import Profile from "./pages/profile/Profile.jsx";
import About from "./pages/about/About.jsx";
import Header from "./components/header/Header.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import CreateListing from "./pages/createlisting/createlisting.jsx";
import UpdateListing from "./pages/updatelisting/UpdateListing.jsx";
import Listing from "./pages/listing/Listing.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<CreateListing />} />
          <Route
            path="/listing/update/:listingId"
            element={<UpdateListing />}
          />
        </Route>

        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
