import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Button from "../components/Button";
import Layout from "../components/Layout";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axiosInstance from "../utils/axios";

export default function Analogy() {
  const analogyId = useRef(null);

  const messageStore = useRef([]);
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("analogy-event", (data) => {
      if (data["analogyId"] == analogyId.current) {
        messageStore.current = [
          ...messageStore.current,
          {
            generated: true,
            message: data["message"],
          },
        ];

        setMessages([...messageStore.current]);
      }
    });

    return () => {
      // Clean up the socket connection when the component unmounts
      socket.disconnect();
    };
  }, []);

  const retrieveMessages = async () => {
    let id = analogyId.current;
    if (id != null || id != "") {
      try {
        let response = await axiosInstance.post("analogy/retrieve", {
          analogyId: id,
        });

        // setMessages(response.data["results"]);
      } catch (err) {
        // Log
      }
    }
  };

  const postMessage = async () => {
    let el = document.getElementById("message");

    if (el.value != "") {
      try {
        let response = await axiosInstance.post("analogy/create", {
          message: el.value,
          analogyId: analogyId.current,
        });

        analogyId.current = response.data["analogyId"];

        messageStore.current = [
          ...messageStore.current,
          {
            generated: false,
            message: el.value,
          },
        ];

        setMessages([...messageStore.current]);
      } catch (err) {
        // Log
      }
      el.value = "";
    }
  };

  return (
    <Layout>
      <div
        className="w-full flex"
        style={{
          maxHeight: "calc(100vh - 72px)",
        }}
      >
        <div className="w-1/6 bg-emerald-800 flex flex-col p-2">
          <div className="flex justify-center">
            <div className="w-full">
              <Button
                text={"New Chat"}
                onClick={() => {
                  alert("Not Implemented!");
                }}
              />
            </div>
          </div>
        </div>
        <div className="w-5/6 max-h-full flex flex-col justify-between">
          <div className="flex flex-col overflow-scroll">
            {messages.map((el) => (
              <div
                className={`px-32 py-8 ${
                  el["generated"] ? "bg-[#ecf1f5]" : ""
                }`}
              >
                {el.message}
              </div>
            ))}
          </div>
          <div className="flex w-5/6 justify-center p-6">
            <div className="flex rounded-md shadow-sm ring-1 ring-gray-300 w-3/6 p-2 items-end">
              <textarea
                type="text"
                name="message"
                id="message"
                className="max-h-96 resize-none block flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
                placeholder="Send a message"
                rows="4"
              />

              <button onClick={() => postMessage()}>
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
