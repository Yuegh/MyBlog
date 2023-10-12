import http from "@/config/request";

/** 分页获取友链 */
export const getFriendLinks = (data) => {
  return new Promise((resolve, reject) => {
    http.post("/api/links/getLinksList", data).then((res) => {
      resolve(res);
    });
  });
};

/** 新增友链 */
export const addFriendLinks = (data) => {
  return new Promise((resolve, reject) => {
    http.post("/api/links/addOrUpdate", data).then((res) => {
      resolve(res);
    });
  });
};
