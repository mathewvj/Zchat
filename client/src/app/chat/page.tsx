import ChatList from "@/components/ChatList";

export default function ChatPage(){
    return (
        <div style={{ display: 'flex', height: '100vh'}}>
            <ChatList/>
            <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <p>Select a user to  start chatting</p>
            </div>
        </div>
    )
}