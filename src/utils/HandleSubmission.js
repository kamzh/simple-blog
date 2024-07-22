import { message } from "antd";

export const handleRegister = async (
  data,
  dispatch,
  createUser,
  setIsSubmitting,
  isSubmitting,
  error,
) => {
  data.email = data.email.toLowerCase();

  if (data.password !== data.repeatPassword) {
    message.error(`Password fields don't match!`, [3.5]);
    return;
  }

  if (
    /\s/.test(data.username) ||
    /\s/.test(data.email) ||
    /\s/.test(data.password)
  ) {
    message.warning("Spaces are not allowed in the input fields.", [3.5]);
    return;
  }

  if (isSubmitting) {
    return;
  }

  try {
    setIsSubmitting(true);
    await dispatch(createUser(data));
    setIsSubmitting(false);

    if (error) {
      message.error(error, 3);
      return;
    }
  } catch (e) {
    console.error(e);
    message.error("An error occurred while creating the user.");
  }
};
