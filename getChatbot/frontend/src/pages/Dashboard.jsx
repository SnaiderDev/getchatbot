import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Dashboard = ({user_}) => {
  return (
    <div className="h-screen w-full">
      <Navbar username={user_?.username}/>
      <Sidebar /> 
        <main className="p-8 overflow-auto">
          {/* Main content will go here */}
        </main>
    </div>
  );
};

export default Dashboard;
