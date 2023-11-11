import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [finalcontact, setFinalContact] = useState(false);

  const [message, setMessage] = useState(null);
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef, landlord]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            onChange={handleChange}
            name="message"
            id="message"
            rows="2"
            value={message}
            placeholder="Enter your message..."
            className="border textarea-primary p-3 rounded-lg"
          ></textarea>
          <div className="flex flex-row gap-2 mx-auto">
            <Link
             
              className="btn btn-success text-center uppercase rounded-lg hover:underline"
            >
              Send message
            </Link>
            <Link
            
              className="btn btn-error text-center uppercase rounded-lg hover:underline"
            >
              Cancel
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
