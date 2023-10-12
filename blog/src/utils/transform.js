/*
 * @author: Zhang Yuming
 * @date: 2023-07-10 15:00:55
 * @params: root 根元素 boxList 观察列表 observe 观察实例 key 观察的名称 rootMargin 偏移值(上 右 下做)
 * @description: 用于观测元素的出现和消失，增加动画
 */

const transform = (root, boxList = [], rootMargin = "") => {
  const observe = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const isAbove = entry.boundingClientRect.y < entry.rootBounds.y;
        if (entry.intersectionRatio > 0 && entry.intersectionRatio < 1) {
          if (isAbove) {
            entry.target.classList.add("above-enter");
          } else {
            entry.target.classList.add("bottom-enter");
          }
        } else {
          new Promise((resolve) => {
            resolve();
          }).then(() => {
            entry.target.classList.remove("above-enter");
            entry.target.classList.remove("bottom-enter");
          });
        }
      });
    },
    {
      root: root || null,
      rootMargin,
    }
  );

  boxList.length &&
    boxList.forEach((box) => {
      observe && observe.observe(box);
    });

  return observe;
};

/*
 * @author: Zhang Yuming
 * @date: 2023-07-10 15:25:25
 * @params: root 根元素 boxList 元素列表
 * @description:
 */
const unObserveBox = (observe, boxList) => {
  boxList.length &&
    boxList.forEach((box) => {
      observe && observe.unobserve(box);
    });
  observe = null;
};

export { transform, unObserveBox };
