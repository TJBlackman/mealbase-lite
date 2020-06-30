// lazy way to duplicate state as a completely new object
// async

export const getNewState = <T>(state: T): T => {
  const str = JSON.stringify(state);
  const newState = JSON.parse(str);
  return newState;
}