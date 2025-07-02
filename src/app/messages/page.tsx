import { cookies } from "next/headers";
import { ChatLayout } from "@/components/ui/messages/chat/chat-layout";

export default async function Home() {
  const layout = (await cookies()).get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  return (
    <div className="w-full mb-4" style={{ height: 'calc(100vh - 64px)' }}>
      <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={8} />
    </div>
  );
}
