import { getApiServer } from "@/src/lib/api";

const prefix = "/api/v1";
// Single source of truth for the backend base URL lives in `src/lib/api`
// (`getApiServer`). Do not duplicate the env/hostname fallback here.
const API_SERVER = getApiServer();
const userEndpoint = {
  GET_ALL_USERS: `${API_SERVER}${prefix}/users`,
  GET_USER_DETAIL_BY_ID: `${API_SERVER}${prefix}/users/{id}`,
  GET_USER_DETAIL_BY_NICKNAME: `${API_SERVER}${prefix}/users/{nickname}`,
};
const projectEndpoint = {
  GET_ALL_PROJECT: `${API_SERVER}${prefix}/project`,
  GET_PROJECT_BY_SLUG: `${API_SERVER}${prefix}/project/{slug}`,
};

const activityEndpointer = {
  GET_IMAGE_ACTIVITY: `${API_SERVER}${prefix}/image-activity`,
  GET_ALL_ALBUM: `${API_SERVER}${prefix}/album`,
  GET_ALBUM_BY_SLUG: `${API_SERVER}${prefix}/album/{slug}`,
};
export { userEndpoint, projectEndpoint, activityEndpointer };
