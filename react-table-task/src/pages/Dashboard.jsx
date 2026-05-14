import { useState } from "react";

import MainLayout from "../layout/MainLayout";

import UserForm from "../components/UserForm";

import DataTable from "../components/DataTable";

const Dashboard = () => {
  // MODAL STATE
  const [showForm, setShowForm] = useState(false);

  return (
    <MainLayout setShowForm={setShowForm}>
      <div className="space-y-5">
        {/* SHOW FORM MODAL */}
        {showForm && (
          <UserForm
            open={showForm}
            handleClose={() => setShowForm(false)}
            editUser={null}
          />
        )}
        {/* TABLE */}
        <DataTable />
      </div>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 mt-10">
        © 2026 React Table Task
      </footer>
    </MainLayout>
  );
};

export default Dashboard;
