const image = {
  beforeMount(el) {
    var img = new Image();
    img.src = el.getAttribute("data-src");
    if (!el.getAttribute("data-src")) return;
    // 创建一个loading的img标签
    let cup = document.createElement("div");
    cup.classList.add("coffee_cup");
    el.appendChild(cup); // 插入dom

    img.onload = () => {
      el.removeChild(cup); // 加载成功移除loading
    };

    img.onerror = () => {
      el.removeChild(cup); // 加载失败移除loading 展示el自定义的错误
    };
  },
};
export default image;
