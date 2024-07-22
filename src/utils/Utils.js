import avatar from "../assets/images/avatar.png";

export function truncateTextAtWord(text, maxLength = 36) {
  if (text?.length <= maxLength) {
    return text;
  } else {
    const lastSpaceIndex = text?.lastIndexOf(" ", maxLength);
    const truncatedText =
      lastSpaceIndex !== -1
        ? text?.substring(0, lastSpaceIndex)
        : text?.substring(0, maxLength);

    return truncatedText + "...";
  }
}

export const renderProfileImage = (image, style) => {
  const handleError = (event) => {
    event.target.src = avatar; 
  };

  if (typeof image === "string" && image.length > 0) {
    return (
      <img
        src={image}
        alt="Profile"
        className={style}
        onError={handleError}
      />
    );
  } else if (image && image.url && image.url.length > 0) {
    return (
      <img
        src={image.url}
        alt="Profile"
        className={style}
        onError={handleError}
      />
    );
  } else {
    return (
      <img
        src={avatar} 
        alt="Avatar Placeholder"
        className={style}
      />
    );
  }
};
