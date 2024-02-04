import React, { useState } from "react";
import axios from "../../api/axios";

const CONTACTUS_URL = "/api/iem-contact-us";

export const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isloading, setIsloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const response = await axios.post(
        CONTACTUS_URL,
        JSON.stringify({ name, email, subject, message }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setIsloading(false);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        alert("Your message was sent successfully");
      }
    } catch (err) {
      setIsloading(false);
      if (!err.response) {
        setErrMsg("Server not responding");
        alert("Not sent");
      } else {
        setErrMsg(err.response.data.message);
        alert("Not sent");
      }
    }
  };
  return (
    <section className="bg-white">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md ">
        <h2 className="mb-4 text-4xl tracking-tight text-center text-gray-900 ">
          Contact Us
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8  ">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Name
            </label>
            <input
              value={name}
              type="text"
              id="name"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
              placeholder="name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Your email
            </label>
            <input
              value={email}
              type="email"
              id="email"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Subject
            </label>
            <input
              value={subject}
              type="text"
              id="subject"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
              placeholder="How we can help you"
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Your message
            </label>
            <textarea
              value={message}
              id="message"
              rows="6"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium  outline-none focus:border-fuchsia-400  focus:shadow-md"
              placeholder="Leave a comment..."
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          {isloading ? (
            <button className="hover:shadow-htmlForm w-full rounded-md hover:bg-fuchsia-400  bg-fuchsia-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
              <svg
                aria-hidden="true"
                role="status"
                className="inline mr-3 w-4 h-4 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                ></path>
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                ></path>
              </svg>
              Loading...
            </button>
          ) : (
            <button className="hover:shadow-htmlForm w-full rounded-md hover:bg-fuchsia-400  bg-fuchsia-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
              Send message
            </button>
          )}
        </form>
      </div>
    </section>
  );
};
