import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addUser, updateUser } from "../features/table/tableThunk";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

const UserForm = ({ open, handleClose, editUser = null }) => {
  const dispatch = useDispatch();

  // USERS FROM REDUX
  const { users } = useSelector((state) => state.table);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      age: "",
      city: "",
    },
  });

  useEffect(() => {
    if (editUser) {
      reset({
        name: editUser.name || "",
        email: editUser.email || "",
        age: editUser.age || "",
        city: editUser.city || "",
      });
    } else {
      reset({
        name: "",
        email: "",
        age: "",
        city: "",
      });
    }
  }, [editUser, reset]);

  // SUBMIT
  const onSubmit = async (data) => {
    try {
      // DUPLICATE EMAIL CHECK
      const emailExists = users.some(
        (user) =>
          (user.email || "").trim().toLowerCase() ===
            data.email.trim().toLowerCase() && user.id !== editUser?.id,
      );

      if (emailExists) {
        toast.error("Duplicate email not allowed. Try different email");
        return;
      }

      const payload = {
        name: data.name?.trim(),
        email: data.email?.trim(),
        city: data.city?.trim(),
        age: Number(data.age),
      };

      if (editUser) {
        await dispatch(
          updateUser({
            id: editUser.id,
            updatedData: payload,
          }),
        ).unwrap();

        toast.success("User Updated Successfully");
      } else {
        await dispatch(addUser(payload)).unwrap();
        toast.success("User Added Successfully");
      }

      handleClose();
      reset({
        name: editUser.name || "",
        email: editUser.email || "",
        age: editUser.age || "",
        city: editUser.city || "",
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // FORM ERROR
  const onError = () => {
    toast.warning("Please fill all fields correctly");
  };

  return (
    // MODAL BACKDROP
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{editUser ? "Edit User" : "Add User"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <DialogContent
          dividers
          className="grid grid-cols-1 md:grid-cols-2 gap-5 !pt-5"
        >
          {/* NAME */}
          <TextField
            label="Name"
            fullWidth
            {...register("name", {
              required: "Name is required",

              pattern: {
                value: /^[A-Za-z ]+$/,
                message: "Only alphabets allowed",
              },

              minLength: {
                value: 3,
                message: "Minimum 3 characters required",
              },

              maxLength: {
                value: 30,
                message: "Maximum 30 characters allowed",
              },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          {/* EMAIL */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            {...register("email", {
              required: "Email is required",

              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,

                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* AGE */}
          <TextField
            label="Age"
            type="number"
            fullWidth
            {...register("age", {
              required: "Age is required",

              valueAsNumber: true,

              min: {
                value: 17,
                message: "Minimum age should be 17",
              },

              max: {
                value: 99,
                message: "Maximum age should be 99",
              },
            })}
            error={!!errors.age}
            helperText={errors.age?.message}
          />

          {/* CITY */}
          <TextField
            label="City"
            fullWidth
            {...register("city", {
              required: "City is required",

              pattern: {
                value: /^[A-Za-z ]+$/,
                message: "Only alphabets allowed",
              },

              minLength: {
                value: 2,
                message: "Minimum 2 characters required",
              },
            })}
            error={!!errors.city}
            helperText={errors.city?.message}
          />
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {editUser ? "Update User" : "Add User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm;
