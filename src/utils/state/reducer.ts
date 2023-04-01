export interface ReducerAction {
  type: string;
  payload?: any;
}

export default function reducer(
  state: Record<string, any>,
  action: ReducerAction
) {
  switch (action.type) {
    case "SET_STATE":
      return action.payload;
    case "SET_ITEMS":
      return {
        ...state,
        items: action.payload,
      };
    case "SET_MAP_KEY":
      return {
        ...state,
        mapKey: action.payload,
      };
    case "SET_COMMANDS":
      return {
        ...state,
        commands: action.payload,
      };
    case "SET_PENDING_ACTION":
      return {
        ...state,
        pendingAction: action.payload,
      };
    case "SET_SOLVE_MODE":
      return {
        ...state,
        solveMode: action.payload,
      };
    case "SET_RESTORE_MODE":
      return {
        ...state,
        restoreMode: action.payload,
      };
    case "SET_OBJECT_MODE":
      return {
        ...state,
        objectMode: action.payload,
      };
    case "SET_PREF_MODE":
      return {
        ...state,
        prefMode: action.payload,
      };
    case "SET_OBJECT_TARGET":
      return {
        ...state,
        objectTarget: action.payload,
      };
    case "SET_DOG_NAME":
      return {
        ...state,
        dogName: action.payload,
      };
    case "MOVE_PLAYER":
      const newPosition = {
        x: state.position.x,
        y: state.position.y,
        z: state.position.z,
      };
      switch (action.payload) {
        case "north":
          newPosition.y = newPosition.y - 1;
          break;
        case "south":
          newPosition.y = newPosition.y + 1;
          break;
        case "east":
          newPosition.x = newPosition.x + 1;
          break;
        case "west":
          newPosition.x = newPosition.x - 1;
          break;
        case "up":
          newPosition.z = newPosition.z + 1;
          break;
        case "down":
          newPosition.z = newPosition.z - 1;
          break;
        default:
          break;
      }
      return {
        ...state,
        position: newPosition,
      };
  }
}
