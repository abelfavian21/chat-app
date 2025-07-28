export const encodeEmail = (email) =>
    email.replaceAll(".", "_dot_").replaceAll("@", "_at_");
  
  export const decodeEmail = (encoded) =>
    encoded.replaceAll("_at_", "@").replaceAll("_dot_", ".");
  