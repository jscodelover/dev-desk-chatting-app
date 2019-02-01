export default function generateId(user, props) {
  return user.userID > props
    ? `${user.userID}${props}`
    : `${props}${user.userID}`;
}
