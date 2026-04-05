import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import { constants } from "../constants";
import type { Chat } from "../types";

const Chat = ({ id }: { id: string }) => {
  // getChatById
  // getMessagesByChat

  const navbarHeight =
    constants.trafficLight.position.y * 2 + constants.trafficLight.diameter;

  return (
    <>
      <div className="flex flex-col mx-auto h-screen xl:max-w-3xl lg:max-w-2xl md:max-w-xl max-w-lg w-full">
        <div className="sticky top-0 flex flex-col w-full">
          <div
            className="w-full bg-white"
            style={{
              height: `${navbarHeight}px`,
            }}
          />
          <div className="w-full h-8 bg-linear-to-b from-white to-white/1" />
        </div>

        <div className="flex flex-col flex-1 gap-8 pb-24">
          {Array.from({ length: 4 }).map((_, i) => (
            <>
              <Message
                data={{
                  id: "msg-" + (i * 2 - 1).toString(),
                  chatId: "chat-a",
                  from: "user",
                  content:
                    "What is the difference between Overfitting and Catastrophic forgetting in Ai terms?",
                  createdAt: new Date(),
                }}
              />
              <Message
                data={{
                  id: "msg-" + (i * 2).toString(),
                  chatId: "chat-a",
                  from: "assistant",
                  content:
                    "Overfitting is when the model memorizies it's training data - often happens when:\n* there are too many epochs\n* too high learning rate\n* poor data quality.\nCatastrophic forgetting is when the Ai model forgets previously learned data from being trained too aggressively.\nTLDR: Overfitting = Model memorizes data instead of learning patterns.\nCatastrophic forgetting = Model trained too hard and forgets previous knowledge",
                  createdAt: new Date(),
                }}
              />
            </>
          ))}
        </div>
        <div className="sticky bottom-0 flex bg-white">
          <MessageInput size="lg" inline />
        </div>
      </div>
    </>
  );
};

export default Chat;
