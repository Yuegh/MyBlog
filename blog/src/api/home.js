import http from "@/config/request"

/** 获取首页数据统计 */
export const homeGetStatistic = () => {
  return new Promise((resolve, reject) => {
    http.get("/api/statistic", {}).then(res => {
      resolve(res)
    })
  })
}
