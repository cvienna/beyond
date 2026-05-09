import Message from "@/components/Message";
import MessageInput from "../components/MessageInput";
import { constants } from "@shared/constants";
import { useChatStore } from "@/store/chat";
import { useUiStore } from "@/store/ui";
import { useEffect } from "react";
import { client } from "@/lib/client";
import { messageResponseSchema } from "@shared/schemas/message";

const Chat = () => {
  const { messages, setMessages } = useChatStore();
  const { route } = useUiStore();

  const navbarHeight =
    constants.trafficLight.position.y * 2 + constants.trafficLight.diameter;

  useEffect(() => {
    if (route.page !== "chat") return;
    if (useChatStore.getState().messages[route.chatId]) return;

    const fetchMessages = async () => {
      const res = await client.api.message[":id"].$get({
        param: { id: route.chatId },
      });
      const data = (await res.json()).data;
      const parsed = messageResponseSchema.array().parse(data);

      setMessages(route.chatId, parsed);
    };

    fetchMessages();
  }, [route]);

  if (route.page !== "chat") return;

  return (
    <>
      <div className="flex flex-col mx-auto h-screen xl:max-w-3xl lg:max-w-2xl md:max-w-xl max-w-lg w-full">
        <div className="sticky top-0 flex flex-col w-full">
          <div
            className="w-full bg-light-bg"
            style={{
              height: `${navbarHeight}px`,
            }}
          />
          <div className="w-full h-8 bg-linear-to-b from-light-bg to-light-bg/1" />
        </div>

        <div className="flex flex-col flex-1 gap-8 pb-24">
          {messages[route.chatId] &&
            messages[route.chatId].map((m, i, arr) => (
              <Message data={m} isLast={i === arr.length - 1} />
            ))}
        </div>
        <div className="sticky bottom-0 flex bg-light-bg">
          <MessageInput size="lg" inline />
        </div>
      </div>
    </>
  );
};

export default Chat;
