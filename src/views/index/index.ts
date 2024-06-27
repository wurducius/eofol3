// import "./index.css";

console.log("Custom logic working!!! [INSIDE]");

export const component1 = {
  name: "component1",
  render: () => "COMPONENT 1 CONTENT",
};

export const component2 = {
  name: "component2",
  render: () => "COMPONENT 2 CONTENT",
};

export const component3 = {
  name: "component3",
  render: () => "COMPONENT 3 CONTENT XXXXXXX",
};

Promise.all([
  fetch("./eofol/index-vdom.json"),
  fetch("./eofol/index-instances.json"),
])
  .then((res) => {
    return Promise.all([res[0].json(), res[1].json()]);
  })
  .then((res) => {
    res[1].forEach((child: { id: any }) => {
      const id = child.id;
      const span = document.getElementById(id);
      if (span) {
        const button = document.createElement("button");
        button.textContent = "Click me!";
        span.appendChild(button);
      }
    });
  });

export default { component1, component2, component3 };
