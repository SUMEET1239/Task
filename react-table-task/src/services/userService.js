const fetchUsers = async () => {
  const response = await fetch("http://localhost:3000/users");

  return await response.json();
};

const addUser = async (user) => {
  const response = await fetch("http://localhost:3000/users", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(user),
  });

  return await response.json();
};

const updateUser = async (id, updatedUser) => {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(updatedUser),
  });

  return await response.json();
};

const deleteUser = async (id) => {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: "DELETE",
  });

  return await response.json();
};

const userService = {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
};

export default userService;
