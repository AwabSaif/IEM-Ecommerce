import React, { useState } from "react";
import axios from "../../api/axios";

const CONTACTUS_URL = "/api/iem-contact-us";

export const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
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
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        alert("Your message was sent successfully");
      }
    } catch (err) {
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
          <button className="hover:shadow-htmlForm w-full rounded-md hover:bg-fuchsia-400  bg-fuchsia-500 py-3 px-8 text-center text-base font-semibold text-white outline-none">
            Send message
          </button>
          {/*     <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Send message
          </button> */}
        </form>
      </div>
    </section>
  );
};
