import styles from "./SubmitButton.css";
import PropTypes from "prop-types";

export default function SubmitButton({
  value,
  password,
  email,
  onRegister,
  username,
}) {
  return (
    <input
      onSubmit={() => onRegister(email, password, username)}
      className={styles.submit}
      type="submit"
      value={value}
    />
  );
}

SubmitButton.propTypes = {
  value: PropTypes.string.isRequired,
  password: PropTypes.string,
  email: PropTypes.string,
  onRegister: PropTypes.func,
  username: PropTypes.string,
};
