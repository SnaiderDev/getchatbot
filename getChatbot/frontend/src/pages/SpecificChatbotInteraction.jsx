import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SpecificChatbotDashboard from "../components/SpecificChatbotDashboard";

const SpecificChatbotInteraction = ({user}) => {
  const { id } = useParams();
  return (
    <div className="w-full">
      <Navbar username={user?.username}/>
      <div className="flex md:flex-row"> 
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto"> 
          <SpecificChatbotDashboard chatbotId={id} />
        </main>
      </div>
    </div>
  );
};


export default SpecificChatbotInteraction;
