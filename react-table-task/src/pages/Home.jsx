import Navbar from "../components/Navbar";
import UserForm from "../components/UserForm";
import DataTable from "../components/DataTable";

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="p-5 max-w-7xl mx-auto">
        <UserForm />
        <DataTable />
      </div>
    </>
  );
};

export default Home;
