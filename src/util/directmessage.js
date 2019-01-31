export default function generateId(user, props) {
  let value =
    user.userID > props ? `${user.userID}${props}` : `${props}${user.userID}`;
  console.log(value);
  return user.userID > props
    ? `${user.userID}${props}`
    : `${props}${user.userID}`;
}
